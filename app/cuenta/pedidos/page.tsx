import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import PedidosClient from './pageClient';

export default async function OrdersPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/cuenta/login?return=%2Fcuenta%2Fpedidos');
  return <PedidosClient />;
}
