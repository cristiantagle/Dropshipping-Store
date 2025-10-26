import { requireUser } from '@/lib/auth/guards';
import AccountClient from './pageClient';

export default async function AccountPage() {
  await requireUser('/cuenta');
  return <AccountClient />;
}
