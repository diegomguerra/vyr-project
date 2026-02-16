// VYR Labs - Apple Health (HealthKit) Integration via Capacitor
// Uses @capgo/capacitor-health plugin (Capacitor 8 compatible)
// Gracefully falls back on web (returns unavailable)

import { Capacitor } from "@capacitor/core";
import { Health, type HealthSample } from "@capgo/capacitor-health";
import type { WearableData } from "./vyr-types";

// ============================================================
// Constants – data type identifiers for @capgo/capacitor-health
// ============================================================

const READ_SCOPES = [
  "heartRate",
  "restingHeartRate",
  "heartRateVariability",
  "sleep",
  "steps",
  "oxygenSaturation",
  "respiratoryRate",
] as const;

// ============================================================
// Public API
// ============================================================

/** Check if HealthKit is available on the current device */
export async function isHealthKitAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { available } = await Health.isAvailable();
    return available;
  } catch {
    return false;
  }
}

/** Request HealthKit read permissions for all VYR-relevant types */
export async function requestHealthKitPermissions(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await Health.requestAuthorization({
      read: [...READ_SCOPES],
      write: [],
    });
    return true;
  } catch (err) {
    console.error("[HealthKit] Permission request failed:", err);
    return false;
  }
}

/** Check if permissions are currently authorized (best-effort) */
export async function isHealthKitAuthorized(): Promise<boolean> {
  return isHealthKitAvailable();
}

// ============================================================
// Data Reading – pulls a day of biometric data → WearableData
// ============================================================

/** Read a day of biometric data and return a VYR WearableData object */
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
    const [hrData, hrvData, restingHRData, sleepData, stepsData, spo2Data] =
      await Promise.all([
        readSafe("heartRate", start, end),
        readSafe("heartRateVariability", start, end),
        readSafe("restingHeartRate", start, end),
        readSafe("sleep", start, end),
        readSafe("steps", start, end),
        readSafe("oxygenSaturation", start, end),
      ]);

    // Resting heart rate
    const rhr = restingHRData.length > 0
      ? avg(restingHRData.map((s) => s.value))
      : hrData.length > 0
      ? Math.min(...hrData.map((s) => s.value))
      : undefined;

    // HRV (SDNN in ms)
    const hrvRawMs = hrvData.length > 0
      ? avg(hrvData.map((s) => s.value))
      : undefined;

    // Normalize HRV to 0-100 index
    const hrvIndex = hrvRawMs !== undefined
      ? Math.max(0, Math.min(100, ((hrvRawMs - 20) / 60) * 100))
      : undefined;

    const sleepInfo = processSleep(sleepData);

    // SpO2 (stored as fraction 0-1 in HealthKit, convert to %)
    const spo2 = spo2Data.length > 0
      ? avg(spo2Data.map((s) => {
          const v = s.value;
          return v <= 1 ? v * 100 : v;
        }))
      : undefined;

    const totalSteps = stepsData.reduce((sum, s) => sum + s.value, 0);
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

async function readSafe(
  dataType: typeof READ_SCOPES[number],
  startDate: string,
  endDate: string,
  limit = 1000
): Promise<HealthSample[]> {
  if (!Capacitor.isNativePlatform()) return [];
  try {
    const { samples } = await Health.readSamples({
      dataType,
      startDate,
      endDate,
      limit,
    });
    return samples ?? [];
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

function processSleep(samples: HealthSample[]): SleepInfo {
  if (samples.length === 0) return {};

  // @capgo/capacitor-health uses sleepState: 'inBed' | 'asleep' | 'awake' | 'rem' | 'deep' | 'light'
  const asleepSamples = samples.filter((s) => {
    const state = s.sleepState;
    return state && state !== "awake" && state !== "inBed";
  });

  const awakeSamples = samples.filter((s) => s.sleepState === "awake");

  let totalSleepMs = 0;
  for (const s of asleepSamples) {
    if (s.startDate && s.endDate) {
      totalSleepMs += new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
    }
  }
  const duration = totalSleepMs > 0 ? totalSleepMs / (1000 * 60 * 60) : undefined;

  const deepRemSamples = samples.filter((s) => {
    const state = s.sleepState;
    return state === "deep" || state === "rem";
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
