import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://jjuuexzrfcnjngxbxine.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqdXVleHpyZmNuam5neGJ4aW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDcwMTcsImV4cCI6MjA4NjQ4MzAxN30.pFlsBLDftATg8ssMcK9uoksqwkIxYvzX7ZViqYaMGZM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
