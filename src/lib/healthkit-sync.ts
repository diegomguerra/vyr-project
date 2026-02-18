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
      category: "sem JWT",
      table: "ring_daily_data",
      operation: "upsert",
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

  const fallbackDay = new Date().toISOString().slice(0, 10);
  const data = await readHealthKitData(fallbackDay);

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
  const day = (data.date && /^\d{4}-\d{2}-\d{2}$/.test(data.date) ? data.date : fallbackDay);
  const rows = [
    {
      user_id: userId,
      day,
      source_provider: "apple_health" as const,
      metrics,
      updated_at: new Date().toISOString(),
    },
  ];

  // Validate: day must be YYYY-MM-DD string, user_id must be present
  if (!rows[0].day || !rows[0].user_id) {
    console.error("[HK][PAYLOAD] invalid payload; skipping write", {
      category: "payload inválido",
      table: "ring_daily_data",
      operation: "upsert",
      hasToken,
      rowsCount: rows.length,
      day: rows[0].day,
      sampleUserId: rows[0].user_id,
    });
    return { success: false, error: "Payload inválido: day ou user_id ausente." };
  }

  console.log("[HK][WRITE] ring_daily_data preflight", {
    userId,
    hasToken,
    rowsCount: rows.length,
    sampleDay: rows[0].day,
    sampleUserId: rows[0].user_id,
  });

  // ─── D) Upsert + result logging ───
  try {
    const { error } = await supabase
      .from("ring_daily_data")
      .upsert(rows[0], { onConflict: "user_id,day,source_provider" });

    if (error) {
      const isRlsMismatch =
        error.code === "42501" &&
        (error.message?.toLowerCase().includes("row-level security") ||
          error.message?.toLowerCase().includes("permission denied"));

      console.error("[HK][ERR] upsert failed", {
        category: isRlsMismatch ? "RLS por mismatch de user_id" : "erro de escrita",
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
          const isInsertRlsMismatch =
            insertError.code === "42501" &&
            (insertError.message?.toLowerCase().includes("row-level security") ||
              insertError.message?.toLowerCase().includes("permission denied"));

          console.error("[HK][ERR] insert fallback failed", {
            category: isInsertRlsMismatch ? "RLS por mismatch de user_id" : "erro de escrita",
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

    console.log("[HK][OK] wrote rows", {
      rowsCount: rows.length,
      table: "ring_daily_data",
      userId,
    });

    return { success: true, metricsWritten: Object.keys(metrics).length > 0 };
  } catch (err) {
    const dbErr = err as { code?: string; message?: string; details?: string; hint?: string };
    const isCatchRlsMismatch =
      dbErr?.code === "42501" &&
      (dbErr?.message?.toLowerCase().includes("row-level security") ||
        dbErr?.message?.toLowerCase().includes("permission denied"));

    console.error("[HK][ERR] unexpected exception", {
      table: "ring_daily_data",
      operation: "upsert",
      userId,
      hasToken,
      rowsCount: rows.length,
      category: isCatchRlsMismatch ? "RLS por mismatch de user_id" : "erro inesperado",
      code: dbErr?.code,
      message: dbErr?.message ?? (err instanceof Error ? err.message : "unknown"),
      details: dbErr?.details,
      hint: dbErr?.hint,
    });
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
