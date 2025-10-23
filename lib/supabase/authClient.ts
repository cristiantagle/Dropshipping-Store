'use client';
import { createBrowserClient } from '@supabase/ssr';

// Browser client backed by cookies so SSR can read the session.
export const supabaseAuth = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
