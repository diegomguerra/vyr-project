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

  const intResult = await upsertIntegration(user.id, "apple_health", "active");
  if (intResult.error) {
    toast({ title: "Erro na integração", description: intResult.error, variant: "destructive" });
    return { success: false, error: intResult.error };
  }
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
  // ─── A) Auth snapshot ───
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData?.session;

  const tokenPreview = session?.access_token
    ? `${session.access_token.slice(0, 6)}...(len=${session.access_token.length})`
    : "NONE";

  console.log("[HK][AUTH] snapshot", {
    userId: session?.user?.id ?? "NONE",
    hasToken: !!session?.access_token,
    tokenPreview,
    expiresAt: session?.expires_at ?? "NONE",
  });

  // ─── B) Refresh if no token ───
  if (!session?.access_token) {
    console.log("[HK][AUTH] No access_token — attempting refreshSession...");
    const { data: refreshData } = await supabase.auth.refreshSession();
    session = refreshData.session;

    const refreshTokenPreview = session?.access_token
      ? `${session.access_token.slice(0, 6)}...(len=${session.access_token.length})`
      : "NONE";

    console.log("[HK][AUTH] After refresh", {
      userId: session?.user?.id ?? "NONE",
      hasToken: !!session?.access_token,
      tokenPreview: refreshTokenPreview,
      expiresAt: session?.expires_at ?? "NONE",
    });
  }

  if (!session?.access_token || !session?.user?.id) {
    console.warn("[HK][AUTH] missing access_token; skipping write", {
      userId: session?.user?.id ?? "NONE",
      hasToken: false,
    });
    toast({
      title: "Falha ao autenticar",
      description: "Faça login novamente.",
      variant: "destructive",
    });
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const userId = session.user.id;
  const hasToken = true;

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
  const rows = [
    {
      user_id: userId,
      day: today,
      source_provider: "apple_health" as const,
      metrics,
      updated_at: new Date().toISOString(),
    },
  ];

  // Validate: day must be YYYY-MM-DD string, user_id must be present
  if (!rows[0].day || !rows[0].user_id) {
    console.error("[HK][WRITE] ABORT: row missing day or user_id", {
      day: rows[0].day,
      user_id: rows[0].user_id,
    });
    return { success: false, error: "Payload inválido: day ou user_id ausente." };
  }

  console.log("[HK][WRITE] table=ring_daily_data", {
    userId,
    hasToken,
    rowsCount: rows.length,
    sampleRowKeys: Object.keys(rows[0]),
    sampleDay: rows[0].day,
    sampleUserId: rows[0].user_id,
  });

  // ─── D) Upsert + result logging ───
  try {
    const { error } = await supabase
      .from("ring_daily_data")
      .upsert(rows[0], { onConflict: "user_id,day,source_provider" });

    if (error) {
      console.error("[HK][ERR] upsert failed", {
        table: "ring_daily_data",
        operation: "upsert",
        userId,
        hasToken,
        rowsCount: rows.length,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // Fallback for 42P10 (missing unique constraint match)
      if (error.code === "42P10") {
        console.log("[HK][WRITE] Fallback to plain insert (42P10)");
        const { error: insertError } = await supabase
          .from("ring_daily_data")
          .insert(rows[0]);

        if (insertError) {
          console.error("[HK][ERR] insert fallback failed", {
            table: "ring_daily_data",
            operation: "insert",
            userId,
            hasToken,
            rowsCount: rows.length,
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
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

    console.log("[HK][OK] wrote rows", {
      rowsCount: rows.length,
      table: "ring_daily_data",
      userId,
    });

    return { success: true, metricsWritten: Object.keys(metrics).length > 0 };
  } catch (err) {
    console.error("[HK][ERR] unexpected exception", {
      table: "ring_daily_data",
      userId,
      hasToken,
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { connected: false, lastSync: null };

  const { data } = await supabase
    .from("user_integrations")
    .select("status, last_sync_at")
    .eq("user_id", user.id)
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
): Promise<{ error?: string }> {
  const { data: existing, error: selectErr } = await supabase
    .from("user_integrations")
    .select("id")
    .eq("user_id", userId)
    .eq("provider", provider)
    .maybeSingle();

  if (selectErr) {
    console.error("[HK][upsertIntegration] select failed", { code: selectErr.code, message: selectErr.message });
    return { error: `[select] ${selectErr.code}: ${selectErr.message}` };
  }

  if (existing) {
    const { error: updateErr } = await supabase
      .from("user_integrations")
      .update({
        status,
        updated_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", existing.id);

    if (updateErr) {
      console.error("[HK][upsertIntegration] update failed", { code: updateErr.code, message: updateErr.message });
      return { error: `[update] ${updateErr.code}: ${updateErr.message}` };
    }
  } else {
    const { error: insertErr } = await supabase.from("user_integrations").insert({
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

    if (insertErr) {
      console.error("[HK][upsertIntegration] insert failed", { code: insertErr.code, message: insertErr.message });
      return { error: `[insert] ${insertErr.code}: ${insertErr.message}` };
    }
  }

  return {};
}
