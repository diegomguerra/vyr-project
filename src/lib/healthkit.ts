// VYR Labs - Apple Health (HealthKit) Integration via Capacitor
// Uses @perfood/capacitor-healthkit plugin
// Gracefully falls back on web (returns unavailable)

import { Capacitor } from "@capacitor/core";
import { CapacitorHealthkit, type OtherData } from "@perfood/capacitor-healthkit";
import type { WearableData } from "./vyr-types";

// ============================================================
// Constants – sample type identifiers (plugin enum values)
// ============================================================

const HK_TYPES = {
  HEART_RATE: "heartRate",
  HRV: "heartRateVariabilitySDNN",
  RESTING_HR: "restingHeartRate",
  SLEEP: "sleepAnalysis",
  STEPS: "stepCount",
  SPO2: "oxygenSaturation",
  BODY_TEMP: "bodyTemperature",
  RESPIRATORY: "respiratoryRate",
  WORKOUT: "workoutType",
} as const;

const ALL_READ_TYPES = Object.values(HK_TYPES);

// ============================================================
// Public API
// ============================================================

/** Check if HealthKit is available on the current device */
export async function isHealthKitAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await CapacitorHealthkit.isAvailable();
    return true;
  } catch {
    return false;
  }
}

/** Request HealthKit read permissions for all VYR-relevant types */
export async function requestHealthKitPermissions(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await CapacitorHealthkit.requestAuthorization({
      all: [],
      read: [...ALL_READ_TYPES],
      write: [],
    });
    // The plugin doesn't expose a reliable "isAuthorized" for read;
    // after the prompt, we assume success (denied = empty query results).
    return true;
  } catch (err) {
    console.error("[HealthKit] Permission request failed:", err);
    return false;
  }
}

/** Check if permissions are currently authorized (best-effort) */
export async function isHealthKitAuthorized(): Promise<boolean> {
  // The plugin has no read-auth check; we just verify availability.
  return isHealthKitAvailable();
}

// ============================================================
// Data Reading – pulls last 24h and maps to WearableData
// ============================================================

/** Read the last 24h of biometric data and return a VYR WearableData object */
export async function readHealthKitData(
  dateStr?: string
): Promise<WearableData | null> {
  if (!Capacitor.isNativePlatform()) return null;

  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const start = startOfDay.toISOString();
  const end = endOfDay.toISOString();
  const isoDate = targetDate.toISOString().slice(0, 10);

  try {
    const [hrData, hrvData, restingHRData, sleepData, stepsData, spo2Data, tempData] =
      await Promise.all([
        querySafe(HK_TYPES.HEART_RATE, start, end),
        querySafe(HK_TYPES.HRV, start, end),
        querySafe(HK_TYPES.RESTING_HR, start, end),
        querySafe(HK_TYPES.SLEEP, start, end),
        querySafe(HK_TYPES.STEPS, start, end),
        querySafe(HK_TYPES.SPO2, start, end),
        querySafe(HK_TYPES.BODY_TEMP, start, end),
      ]);

    // Process heart rate → resting HR
    const rhr = restingHRData.length > 0
      ? avg(restingHRData.map((s) => s.value ?? 0))
      : hrData.length > 0
      ? Math.min(...hrData.map((s) => s.value ?? 999))
      : undefined;

    // Process HRV (SDNN in ms)
    const hrvRawMs = hrvData.length > 0
      ? avg(hrvData.map((s) => s.value ?? 0))
      : undefined;

    // Normalize HRV to 0-100 index
    const hrvIndex = hrvRawMs !== undefined
      ? Math.max(0, Math.min(100, ((hrvRawMs - 20) / 60) * 100))
      : undefined;

    const sleepInfo = processSleep(sleepData);

    // SpO2 (stored as fraction 0-1 in HealthKit, convert to %)
    const spo2 = spo2Data.length > 0
      ? avg(spo2Data.map((s) => {
          const v = s.value ?? 0;
          return v <= 1 ? v * 100 : v;
        }))
      : undefined;

    const bodyTemperature = tempData.length > 0
      ? avg(tempData.map((s) => s.value ?? 0))
      : undefined;

    const totalSteps = stepsData.reduce((sum, s) => sum + (s.value ?? 0), 0);
    const previousDayActivity = totalSteps > 12000
      ? ("high" as const)
      : totalSteps > 6000
      ? ("medium" as const)
      : ("low" as const);

    const data: WearableData = {
      date: isoDate,
      ...(rhr !== undefined && { rhr: Math.round(rhr) }),
      ...(hrvIndex !== undefined && { hrvIndex: Math.round(hrvIndex) }),
      ...(hrvRawMs !== undefined && { hrvRawMs: Math.round(hrvRawMs) }),
      ...(sleepInfo.duration !== undefined && { sleepDuration: sleepInfo.duration }),
      ...(sleepInfo.quality !== undefined && { sleepQuality: sleepInfo.quality }),
      ...(sleepInfo.awakenings !== undefined && { awakenings: sleepInfo.awakenings }),
      ...(spo2 !== undefined && { spo2: Math.round(spo2 * 10) / 10 }),
      ...(bodyTemperature !== undefined && { bodyTemperature: Math.round(bodyTemperature * 10) / 10 }),
      previousDayActivity,
    };

    return data;
  } catch (err) {
    console.error("[HealthKit] Error reading data:", err);
    return null;
  }
}

// ============================================================
// Internal Helpers
// ============================================================

interface RawSample {
  value?: number;
  startDate?: string;
  endDate?: string;
  source?: string;
  [key: string]: any;
}

async function querySafe(
  sampleName: string,
  startDate: string,
  endDate: string,
  limit = 1000
): Promise<RawSample[]> {
  if (!Capacitor.isNativePlatform()) return [];
  try {
    const { resultData } = await CapacitorHealthkit.queryHKitSampleType<OtherData>({
      sampleName,
      startDate,
      endDate,
      limit,
    });
    return resultData ?? [];
  } catch {
    return [];
  }
}

function avg(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

interface SleepInfo {
  duration?: number;
  quality?: number;
  awakenings?: number;
}

function processSleep(samples: RawSample[]): SleepInfo {
  if (samples.length === 0) return {};

  // HealthKit sleep values: 0=InBed, 1=Asleep, 2=Awake, 3=Core, 4=Deep, 5=REM
  const asleepSamples = samples.filter((s) => {
    const v = s.value ?? 0;
    return v >= 1 && v !== 2;
  });

  const awakeSamples = samples.filter((s) => (s.value ?? 0) === 2);

  let totalSleepMs = 0;
  for (const s of asleepSamples) {
    if (s.startDate && s.endDate) {
      totalSleepMs += new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
    }
  }
  const duration = totalSleepMs > 0 ? totalSleepMs / (1000 * 60 * 60) : undefined;

  const deepRemSamples = samples.filter((s) => {
    const v = s.value ?? 0;
    return v === 4 || v === 5;
  });
  let deepRemMs = 0;
  for (const s of deepRemSamples) {
    if (s.startDate && s.endDate) {
      deepRemMs += new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
    }
  }
  const quality =
    totalSleepMs > 0
      ? Math.round(Math.min(100, (deepRemMs / totalSleepMs) * 100 * 2.5))
      : undefined;

  return {
    duration: duration !== undefined ? Math.round(duration * 10) / 10 : undefined,
    quality,
    awakenings: awakeSamples.length > 0 ? awakeSamples.length : undefined,
  };
}
