import { createClient, type SupabaseClient } from "@supabase/supabase-js";
/** Devuelve un cliente sólo si hay envs públicas; si faltan, retorna null. */
export function supabaseServer(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}
