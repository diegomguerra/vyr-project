// VYR Labs - HealthKit Sync Service
// Reads HealthKit data and persists to ring_daily_data + user_integrations

import { supabase } from "@/integrations/supabase/client";
import {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  isHealthKitAuthorized,
  readHealthKitData,
} from "./healthkit";
import { getValidSession } from "./auth-session";
import { toast } from "@/hooks/use-toast";

export interface SyncResult {
  success: boolean;
  error?: string;
  metricsWritten?: boolean;
}

// ============================================================
// Public API
// ============================================================

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

  const session = await getValidSession();

  const tokenPreview = session?.access_token
    ? `${session.access_token.slice(0, 6)}...(len=${session.access_token.length})`
    : "NONE";

  console.log("[HK][connectAppleHealth][AUTH]", {
    userId: session?.user?.id ?? "NONE",
    hasToken: !!session?.access_token,
    tokenPreview,
  });

  if (!session?.access_token || !session?.user?.id) {
    toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const userId = session.user.id;

  // Atomic upsert — no race condition
  const { error: upsertErr } = await supabase
    .from("user_integrations")
    .upsert(
      {
        user_id: userId,
        provider: "apple_health",
        status: "active",
        last_error: null,
        scopes: ["heart_rate", "hrv", "sleep", "steps", "spo2", "body_temperature", "workouts"],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

  if (upsertErr) {
    console.error("[HK][connectAppleHealth][ERR] upsert user_integrations failed", {
      code: upsertErr.code,
      message: upsertErr.message,
    });
    toast({ title: "Erro na integração", description: `[${upsertErr.code}] ${upsertErr.message}`, variant: "destructive" });
    return { success: false, error: upsertErr.message };
  }

  return syncHealthKitData();
}

/** Disconnect Apple Health */
export async function disconnectAppleHealth(): Promise<void> {
  const session = await getValidSession();
  if (!session?.user?.id) return;

  await supabase
    .from("user_integrations")
    .update({ status: "disconnected", updated_at: new Date().toISOString() })
    .eq("user_id", session.user.id)
    .eq("provider", "apple_health");
}

/** Sync today's HealthKit data to ring_daily_data */
export async function syncHealthKitData(): Promise<SyncResult> {
  // ─── A) Auth snapshot ───
  const session = await getValidSession();

  const tokenPreview = session?.access_token
    ? `${session.access_token.slice(0, 6)}...(len=${session.access_token.length})`
    : "NONE";

  console.log("[HK][AUTH] snapshot", {
    userId: session?.user?.id ?? "NONE",
    hasToken: !!session?.access_token,
    tokenPreview,
    expiresAt: session?.expires_at ?? "NONE",
  });

  if (!session?.access_token || !session?.user?.id) {
    console.warn("[HK][AUTH] missing access_token; skipping write");
    toast({
      title: "Falha ao autenticar",
      description: "Faça login novamente.",
      variant: "destructive",
    });
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const userId = session.user.id;

  // ─── E) Client sanity check ───
  console.log("[HK][CLIENT] supabaseUrl present?", !!(supabase as any)?.supabaseUrl);
  console.log("[HK][CLIENT] auth.getSession exists?", typeof supabase?.auth?.getSession === "function");

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

  // ─── C) Build rows and validate ───
  const row = {
    user_id: userId,
    day: today,
    source_provider: "apple_health" as const,
    metrics,
    updated_at: new Date().toISOString(),
  };

  if (!row.day || !row.user_id) {
    console.error("[HK][WRITE] ABORT: row missing day or user_id", { day: row.day, user_id: row.user_id });
    return { success: false, error: "Payload inválido: day ou user_id ausente." };
  }

  console.log("[HK][WRITE] table=ring_daily_data", {
    userId,
    rowKeys: Object.keys(row),
    day: row.day,
  });

  // ─── D) Upsert + result logging ───
  try {
    const { error } = await supabase
      .from("ring_daily_data")
      .upsert(row, { onConflict: "user_id,day,source_provider" });

    if (error) {
      console.error("[HK][ERR] upsert failed", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // Fallback for 42P10 (missing unique constraint match)
      if (error.code === "42P10") {
        console.log("[HK][WRITE] Fallback to plain insert (42P10)");
        const { error: insertError } = await supabase.from("ring_daily_data").insert(row);

        if (insertError) {
          console.error("[HK][ERR] insert fallback failed", {
            code: insertError.code,
            message: insertError.message,
          });
          toast({ title: "Falha ao sincronizar dados do Health", description: `[${insertError.code}] ${insertError.message}`, variant: "destructive" });
          return { success: false, error: insertError.message };
        }
      } else {
        toast({ title: "Falha ao sincronizar dados do Health", description: `[${error.code}] ${error.message}`, variant: "destructive" });
        return { success: false, error: error.message };
      }
    }

    // Update last_sync_at
    await supabase
      .from("user_integrations")
      .update({ last_sync_at: new Date().toISOString(), last_error: null })
      .eq("user_id", userId)
      .eq("provider", "apple_health");

    console.log("[HK][OK] wrote row", { table: "ring_daily_data", userId, day: today });

    return { success: true, metricsWritten: Object.keys(metrics).length > 0 };
  } catch (err) {
    console.error("[HK][ERR] unexpected exception", {
      error: err instanceof Error ? err.message : "unknown",
    });
    toast({ title: "Falha ao sincronizar dados do Health", description: `[exception] ${err instanceof Error ? err.message : "unknown"}`, variant: "destructive" });
    return { success: false, error: err instanceof Error ? err.message : "Erro inesperado" };
  }
}

/** Load integration status from DB (gets userId from current session) */
export async function getAppleHealthStatus(): Promise<{
  connected: boolean;
  lastSync: Date | null;
}> {
  const session = await getValidSession();
  if (!session?.user?.id) return { connected: false, lastSync: null };

  const { data } = await supabase
    .from("user_integrations")
    .select("status, last_sync_at")
    .eq("user_id", session.user.id)
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
