import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function supabaseAdmin() {
  return createClient(url, service, { auth: { persistSession: false } });
}

export function supabaseAnon() {
  return createClient(url, anon, { auth: { persistSession: false } });
}
