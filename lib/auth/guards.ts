import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

// Require an authenticated user on the server and redirect to login if missing.
// Returns the user object when authenticated.
export async function requireUser(returnPath: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const dest = `/cuenta/login?return=${encodeURIComponent(returnPath || '/')}`;
    redirect(dest);
  }
  return user;
}
