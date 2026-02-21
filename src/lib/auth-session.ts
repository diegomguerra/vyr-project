// VYR Labs - Auth Session Helper
// avoid stale auth in iOS WKWebView; ensure valid session before DB writes
//
// NEVER use supabase.auth.getUser() before INSERTs — use requireValidUserId() here.
// getUser() reads from local cache and may return a user even when the JWT has expired,
// causing auth.uid() = null in Postgres → RLS 42501 errors.

import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

/** Buffer in seconds — refresh token if it expires within this window */
const EXPIRY_BUFFER_SECONDS = 120; // 2 minutes

/**
 * Returns a valid Session with access_token + user, or null.
 *
 * Strategy:
 *   1. getSession()  — reads persisted token from storage
 *   2. if token is missing OR expires within EXPIRY_BUFFER_SECONDS → refreshSession()
 *   3. returns final session (or null if unauthenticated)
 *
 * DEV note: logs userId + expires_at for traceability (no token value is logged).
 */
export async function requireValidSession(): Promise<Session | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData?.session;

  const needsRefresh =
    !session?.access_token ||
    (session.expires_at != null && session.expires_at - Math.floor(Date.now() / 1000) < EXPIRY_BUFFER_SECONDS);

  if (needsRefresh) {
    // Token absent, expired, or about to expire — attempt silent refresh
    const { data: refreshData } = await supabase.auth.refreshSession();
    session = refreshData.session;
  }

  if (import.meta.env.DEV && session?.user) {
    console.log("[AUTH] session valid", {
      userId: session.user.id,
      expiresAt: session.expires_at,
      refreshed: needsRefresh,
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

/**
 * Retry-on-42501 wrapper.
 * Executes a DB write. If it fails with code 42501 (RLS violation),
 * refreshes the session and retries once.
 *
 * Usage:
 *   const { error } = await retryOnAuthError(() =>
 *     supabase.from("table").insert({ user_id: userId, ... })
 *   );
 */
export async function retryOnAuthError<T extends { error: { code?: string; message: string } | null }>(
  fn: () => PromiseLike<T>
): Promise<T> {
  const result = await fn();

  if (result.error?.code === "42501") {
    console.warn("[AUTH] 42501 detected — refreshing session and retrying");
    const { data: refreshData } = await supabase.auth.refreshSession();

    if (refreshData.session?.access_token) {
      // Retry with fresh token
      return fn();
    }
    // Refresh failed — return original error
    console.error("[AUTH] refresh failed after 42501");
  }

  return result;
}

// ── Legacy aliases (kept for backward compat with healthkit-sync imports) ──
export const getValidSession = requireValidSession;
export const getValidUserId = requireValidUserId;
