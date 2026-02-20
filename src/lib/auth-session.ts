// VYR Labs - Auth Session Helper
// avoid stale auth in iOS WKWebView; ensure valid session before DB writes
//
// NEVER use supabase.auth.getUser() before INSERTs — use requireValidUserId() here.
// getUser() reads from local cache and may return a user even when the JWT has expired,
// causing auth.uid() = null in Postgres → RLS 42501 errors.

import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

/**
 * Returns a valid Session with access_token + user, or null.
 *
 * Strategy:
 *   1. getSession()  — reads persisted token from storage
 *   2. if no access_token → refreshSession() to obtain a new one
 *   3. returns final session (or null if unauthenticated)
 *
 * DEV note: logs userId + expires_at for traceability (no token value is logged).
 */
export async function requireValidSession(): Promise<Session | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData?.session;

  if (!session?.access_token) {
    // Token absent or expired — attempt silent refresh before giving up
    const { data: refreshData } = await supabase.auth.refreshSession();
    session = refreshData.session;
  }

  if (import.meta.env.DEV && session?.user) {
    console.log("[AUTH] session valid", {
      userId: session.user.id,
      expiresAt: session.expires_at,
    });
  }

  return session ?? null;
}

/**
 * Returns the authenticated user's ID, or null if the session is invalid/expired.
 *
 * Usage:
 *   const userId = await requireValidUserId();
 *   if (!userId) return; // abort — not authenticated
 *   await supabase.from("table").insert({ user_id: userId, ... });
 */
export async function requireValidUserId(): Promise<string | null> {
  const session = await requireValidSession();
  return session?.user?.id ?? null;
}

// ── Legacy aliases (kept for backward compat with healthkit-sync imports) ──
export const getValidSession = requireValidSession;
export const getValidUserId = requireValidUserId;
