import { createClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import type { Database } from "./types";

// Prefer env vars; keep current fallbacks to avoid breaking builds unexpectedly
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://jjuuexzrfcnjngxbxine.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqdXVleHpyZmNuam5neGJ4aW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDcwMTcsImV4cCI6MjA4NjQ4MzAxN30.pFlsBLDftATg8ssMcK9uoksqwkIxYvzX7ZViqYaMGZM";

// Capacitor-safe storage for iOS/Android WebView.
// Avoids localStorage inconsistencies that can lead to stale/anon requests → RLS 42501.
const capacitorStorage = {
  async getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },
  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  },
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // On native platforms, use Capacitor Preferences as storage.
    // On web, Supabase defaults to localStorage (safe).
    storage: Capacitor.isNativePlatform() ? capacitorStorage : undefined,

    persistSession: true,
    autoRefreshToken: true,

    // In native apps you usually do NOT use URL-based auth callbacks.
    detectSessionInUrl: !Capacitor.isNativePlatform(),
  },
});
