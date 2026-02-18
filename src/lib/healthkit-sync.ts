// VYR Labs - HealthKit Sync Service
// Reads HealthKit data and persists to ring_daily_data + user_integrations

import { supabase } from "@/integrations/supabase/client";
import {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  isHealthKitAuthorized,
  readHealthKitData,
} from "./healthkit";
import { toast } from "@/hooks/use-toast";
import type { WearableProvider } from "./vyr-types";

export interface SyncResult {
  success: boolean;
  error?: string;
  metricsWritten?: boolean;
}

/** Full connect flow: check availability → request permissions → initial sync → persist integration */
export async function connectAppleHealth(): Promise<SyncResult> {
  const available = await isHealthKitAvailable();
  if (!available) {
    return { success: false, error: "HealthKit não disponível neste dispositivo." };
  }

  const authorized = await requestHealthKitPermissions();
  if (!authorized) {
    return { success: false, error: "Permissões do Apple Health não foram concedidas." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  await upsertIntegration(user.id, "apple_health", "active");
  const syncResult = await syncHealthKitData();
  return syncResult;
}

/** Disconnect Apple Health */
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
export async function syncHealthKitData(): Promise<SyncResult> {
  // 1) Check current session & access_token
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData?.session;

  console.log("[HealthKit Sync] access_token present?", !!session?.access_token);
  console.log("[HealthKit Sync] user id", session?.user?.id);

  // 2) If no access_token, try refresh once
  if (!session?.access_token) {
    console.log("[HealthKit Sync] No access_token — attempting refreshSession...");
    const { data: refreshData } = await supabase.auth.refreshSession();
    session = refreshData.session;
    console.log("[HealthKit Sync] After refresh — access_token present?", !!session?.access_token);
    console.log("[HealthKit Sync] After refresh — user id", session?.user?.id);
  }

  // 3) Abort if still no valid token — never write as anon
  if (!session?.access_token || !session?.user?.id) {
    console.error("[HealthKit Sync] No access_token available — aborting write.");
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  // 4) userId always from session — never accept external user_id
  const userId = session.user.id;
  console.log("[HealthKit Sync] Authenticated as:", userId);

  const authorized = await isHealthKitAuthorized();
  if (!authorized) {
    return { success: false, error: "Permissões Apple Health revogadas." };
  }

  const today = new Date().toISOString().slice(0, 10);
  const data = await readHealthKitData(today);

  if (!data) {
    return { success: true, metricsWritten: false };
  }

  // Build metrics JSONB
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

  // Upsert — userId is guaranteed to match auth.uid() from the active session
  try {
    const upsertPayload = {
      user_id: userId,
      day: today,
      source_provider: "apple_health",
      metrics,
      updated_at: new Date().toISOString(),
    };

    console.log("[HealthKit Sync] Upserting ring_daily_data", {
      user_id: userId,
      day: today,
      metricsCount: Object.keys(metrics).length,
      batchSize: 1,
      accessTokenPresent: true,
    });

    const { error } = await supabase
      .from("ring_daily_data")
      .upsert(upsertPayload, { onConflict: "user_id,day,source_provider" });

    if (error) {
      console.error("[HealthKit Sync] Upsert failed:", {
        table: "ring_daily_data",
        operation: "upsert",
        userId,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      if (error.code === "42P10") {
        console.log("[HealthKit Sync] Fallback to insert (42P10)");
        const { error: insertError } = await supabase
          .from("ring_daily_data")
          .insert({ user_id: userId, day: today, source_provider: "apple_health", metrics });

        if (insertError) {
          console.error("[HealthKit Sync] Insert fallback failed:", {
            table: "ring_daily_data",
            operation: "insert",
            userId,
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
          });
          toast({ title: "Falha ao sincronizar dados do Health", description: "Tente novamente mais tarde.", variant: "destructive" });
          return { success: false, error: insertError.message };
        }
      } else {
        toast({ title: "Falha ao sincronizar dados do Health", description: "Tente novamente mais tarde.", variant: "destructive" });
        return { success: false, error: error.message };
      }
    }

    // Update last_sync_at
    await supabase
      .from("user_integrations")
      .update({ last_sync_at: new Date().toISOString(), last_error: null })
      .eq("user_id", userId)
      .eq("provider", "apple_health");

    console.log("[HealthKit Sync] Success. Metrics written:", Object.keys(metrics).length);
    return { success: true, metricsWritten: Object.keys(metrics).length > 0 };
  } catch (err) {
    console.error("[HealthKit Sync] Unexpected error:", err);
    toast({ title: "Falha ao sincronizar dados do Health", description: "Tente novamente mais tarde.", variant: "destructive" });
    return { success: false, error: err instanceof Error ? err.message : "Erro inesperado" };
  }
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
