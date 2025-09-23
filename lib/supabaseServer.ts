import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Crea un cliente sólo si existen las env públicas. Devuelve null si faltan. */
export function supabaseServer(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}
