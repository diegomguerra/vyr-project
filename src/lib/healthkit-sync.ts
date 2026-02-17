// VYR Labs - HealthKit Sync Service
// Reads HealthKit data and persists to ring_daily_data + user_integrations

import { supabase } from "@/integrations/supabase/client";
import {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  isHealthKitAuthorized,
  readHealthKitData,
} from "./healthkit";
import type { WearableProvider } from "./vyr-types";

export interface SyncResult {
  success: boolean;
  error?: string;
  metricsWritten?: boolean;
}

/** Full connect flow: check availability → request permissions → initial sync → persist integration */
export async function connectAppleHealth(): Promise<SyncResult> {
  // 1. Check device availability
  const available = await isHealthKitAvailable();
  if (!available) {
    return { success: false, error: "HealthKit não disponível neste dispositivo." };
  }

  // 2. Request permissions
  const authorized = await requestHealthKitPermissions();
  if (!authorized) {
    return { success: false, error: "Permissões do Apple Health não foram concedidas." };
  }

  // 3. Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  // 4. Persist integration record
  await upsertIntegration(user.id, "apple_health", "active");

  // 5. Initial data sync
  const syncResult = await syncHealthKitData(user.id);

  return syncResult;
}

/** Disconnect Apple Health: update integration status and remove data source */
export async function disconnectAppleHealth(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("user_integrations")
    .update({ status: "disconnected", updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("provider", "apple_health");
}

/** Sync today's HealthKit data to ring_daily_data */
export async function syncHealthKitData(userId?: string): Promise<SyncResult> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  }
  if (!userId) return { success: false, error: "Não autenticado." };

  // Check authorization
  const authorized = await isHealthKitAuthorized();
  if (!authorized) {
    return { success: false, error: "Permissões Apple Health revogadas." };
  }

  // Read today's data
  const today = new Date().toISOString().slice(0, 10);
  const data = await readHealthKitData(today);

  if (!data) {
    return { success: true, metricsWritten: false };
  }

  // Build metrics JSONB matching ring_daily_data.metrics shape
  const metrics: Record<string, any> = {};
  if (data.rhr !== undefined) metrics.rhr = data.rhr;
  if (data.hrvRawMs !== undefined) metrics.hrv_ms = data.hrvRawMs;
  if (data.hrvIndex !== undefined) metrics.hrv_index = data.hrvIndex;
  if (data.sleepDuration !== undefined) metrics.sleep_hours = data.sleepDuration;
  if (data.sleepQuality !== undefined) metrics.sleep_quality = data.sleepQuality;
  if (data.awakenings !== undefined) metrics.awakenings = data.awakenings;
  if (data.spo2 !== undefined) metrics.spo2 = data.spo2;
  if (data.bodyTemperature !== undefined) metrics.body_temp = data.bodyTemperature;
  if (data.previousDayActivity) metrics.activity_level = data.previousDayActivity;

  // Debug: verify userId matches auth session
  const { data: { session } } = await supabase.auth.getSession();
  console.log("[HealthKit Sync] userId param:", userId);
  console.log("[HealthKit Sync] auth.uid():", session?.user?.id);
  console.log("[HealthKit Sync] match:", userId === session?.user?.id);

  // Upsert to ring_daily_data
  const { error } = await supabase
    .from("ring_daily_data")
    .upsert(
      {
        user_id: userId,
        day: today,
        source_provider: "apple_health",
        metrics,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,day,source_provider" }
    );

  if (error) {
    console.error("[HealthKit Sync] Error writing ring_daily_data:", error);
    // If upsert fails due to no unique constraint, try insert
    if (error.code === "42P10") {
      const { error: insertError } = await supabase
        .from("ring_daily_data")
        .insert({
          user_id: userId,
          day: today,
          source_provider: "apple_health",
          metrics,
        });
      if (insertError) {
        return { success: false, error: insertError.message };
      }
    } else {
      return { success: false, error: error.message };
    }
  }

  // Update last_sync_at on integration
  await supabase
    .from("user_integrations")
    .update({ last_sync_at: new Date().toISOString(), last_error: null })
    .eq("user_id", userId)
    .eq("provider", "apple_health");

  return { success: true, metricsWritten: Object.keys(metrics).length > 0 };
}

/** Load integration status from DB */
export async function getAppleHealthStatus(userId: string): Promise<{
  connected: boolean;
  lastSync: Date | null;
}> {
  const { data } = await supabase
    .from("user_integrations")
    .select("status, last_sync_at")
    .eq("user_id", userId)
    .eq("provider", "apple_health")
    .maybeSingle();

  if (!data || data.status !== "active") {
    return { connected: false, lastSync: null };
  }

  return {
    connected: true,
    lastSync: data.last_sync_at ? new Date(data.last_sync_at) : null,
  };
}

// ============================================================
// Internal
// ============================================================

async function upsertIntegration(
  userId: string,
  provider: WearableProvider,
  status: string
) {
  // Check if integration already exists
  const { data: existing } = await supabase
    .from("user_integrations")
    .select("id")
    .eq("user_id", userId)
    .eq("provider", provider)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_integrations")
      .update({
        status,
        updated_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("user_integrations").insert({
      user_id: userId,
      provider,
      status,
      scopes: [
        "heart_rate",
        "hrv",
        "sleep",
        "steps",
        "spo2",
        "body_temperature",
        "workouts",
      ],
    });
  }
}
