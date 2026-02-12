import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();

    // Validate webhook secret
    const webhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = Deno.env.get("WEBHOOK_SECRET");
    const signatureValid = webhookSecret === expectedSecret;

    // Log the webhook
    await supabase.from("webhook_logs").insert({
      provider: body.provider || "qring",
      event_type: body.event_type || "daily_sync",
      signature_valid: signatureValid,
      payload_hash: body.payload_hash || null,
      idempotency_key: body.idempotency_key || null,
      user_id: body.user_id || null,
      status: signatureValid ? "processed" : "rejected",
      error: signatureValid ? null : "Invalid webhook secret",
    });

    if (!signatureValid) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook secret" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find user by external_user_id
    const { data: integration } = await supabase
      .from("user_integrations")
      .select("user_id")
      .eq("external_user_id", body.external_user_id)
      .eq("provider", body.provider || "qring")
      .single();

    if (!integration) {
      return new Response(
        JSON.stringify({ error: "User integration not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = integration.user_id;

    // Normalize metrics from QRing format
    const metrics = {
      rhr: body.metrics?.heart_rate ?? body.metrics?.rhr,
      hrv_ms: body.metrics?.hrv ?? body.metrics?.hrv_ms,
      spo2: body.metrics?.spo2,
      body_temperature: body.metrics?.temperature ?? body.metrics?.body_temperature,
      stress_score: body.metrics?.stress ?? body.metrics?.stress_score,
      sleep_duration_hours: body.metrics?.sleep_duration,
      sleep_quality: body.metrics?.sleep_quality,
      sleep_stages: body.metrics?.sleep_stages,
      sleep_latency_min: body.metrics?.sleep_latency,
      sleep_efficiency: body.metrics?.sleep_efficiency,
      steps: body.metrics?.steps,
      distance_km: body.metrics?.distance_km,
      calories: body.metrics?.calories,
      activity_score: body.metrics?.activity_score,
    };

    // Upsert ring_daily_data
    const { error: upsertError } = await supabase
      .from("ring_daily_data")
      .upsert(
        {
          user_id: userId,
          day: body.day || new Date().toISOString().split("T")[0],
          source_provider: body.provider || "qring",
          metrics,
        },
        { onConflict: "user_id,day,source_provider" }
      );

    if (upsertError) throw upsertError;

    // Update last_sync_at
    await supabase
      .from("user_integrations")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("provider", body.provider || "qring");

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Ingest error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
