import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseClient = createClient(url, key, { auth: { persistSession: false } });

export async function supabaseFetch<T>(
  fn: (c: ReturnType<typeof createClient>) => Promise<T>,
  retries = 2
): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn(supabaseClient as any);
    } catch (err) {
      lastError = err;
      console.warn("Supabase fetch failed, intento", i + 1, err);
      await new Promise(r => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastError;
}
