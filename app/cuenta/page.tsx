import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import AccountClient from './pageClient';

export default async function AccountPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/cuenta/login');
  return <AccountClient />;
}
