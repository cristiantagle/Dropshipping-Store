import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Crea un cliente de Supabase sólo si existen las env públicas.
 * Devuelve `null` si faltan, así el caller puede mostrar skeletons/mocks.
 */
export function supabaseServer(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    return createClient(url, anon, { auth: { persistSession: false } });
  } catch {
    return null;
  }
}
