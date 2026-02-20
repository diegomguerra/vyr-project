// VYR Labs - Auth Session Helper
// Garante um JWT válido antes de qualquer operação de escrita no banco.
// NUNCA use supabase.auth.getUser() antes de INSERTs — use getValidUserId() aqui.

import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

/**
 * Retorna a sessão ativa com token válido.
 * Se não houver token, tenta refreshSession() antes de desistir.
 * 
 * Uso: substitua supabase.auth.getUser() por getValidSession() antes de qualquer INSERT/UPDATE.
 */
export async function getValidSession(): Promise<Session | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData?.session;

  if (!session?.access_token) {
    console.log("[AUTH] No access_token — attempting refreshSession...");
    const { data: refreshData } = await supabase.auth.refreshSession();
    session = refreshData.session;
  }

  return session ?? null;
}

/**
 * Retorna o user_id da sessão válida, ou null se não autenticado.
 * 
 * Uso:
 *   const userId = await getValidUserId();
 *   if (!userId) return; // não autenticado
 *   await supabase.from("table").insert({ user_id: userId, ... });
 */
export async function getValidUserId(): Promise<string | null> {
  const session = await getValidSession();
  return session?.user?.id ?? null;
}
