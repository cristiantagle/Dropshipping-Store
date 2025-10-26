import { requireUser } from '@/lib/auth/guards';
import PedidosClient from './pageClient';

export default async function OrdersPage() {
  await requireUser('/cuenta/pedidos');
  return <PedidosClient />;
}
