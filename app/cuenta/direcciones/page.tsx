import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import DireccionesClient from './pageClient';

type Address = {
  id: string;
  full_name: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postal_code: string | null;
  country: string;
  phone: string | null;
  is_default: boolean;
};

const empty: Address = {
  id: '',
  full_name: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postal_code: '',
  country: 'CL',
  phone: '',
  is_default: false,
};

export default async function AddressesPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/cuenta/login?return=%2Fcuenta%2Fdirecciones');
  return <DireccionesClient />;
}
