import { requireUser } from '@/lib/auth/guards';
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
  await requireUser('/cuenta/direcciones');
  return <DireccionesClient />;
}
