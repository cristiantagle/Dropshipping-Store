import { requireUser } from '@/lib/auth/guards';
import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser('/cuenta/pedidos');
  const supabase = await supabaseServer();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !order) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-gray-600">Pedido no encontrado.</p>
        <Link href="/cuenta/pedidos" className="text-lime-700 hover:underline">
          Volver a pedidos
        </Link>
      </main>
    );
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, title, quantity, unit_price_cents, image_url')
    .eq('order_id', order.id);

  const { data: addr } = await supabase
    .from('user_addresses')
    .select('full_name, line1, line2, city, region, postal_code, country, phone, is_default')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .maybeSingle();

  const total = (order.total_cents || 0) / 100;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
        <Link href="/cuenta/pedidos" className="text-lime-700 hover:underline">
          Volver
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-2 font-semibold">Estado</h2>
          <div className="capitalize">{order.status}</div>
          <div className="text-sm text-gray-600">
            Creado: {new Date(order.created_at).toLocaleString()}
          </div>
          <div className="mt-2 text-lg font-bold text-lime-700">
            {total.toLocaleString('es-CL', {
              style: 'currency',
              currency: order.currency || 'CLP',
              minimumFractionDigits: 0,
            })}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-2 font-semibold">Comprador</h2>
          <div className="text-sm text-gray-700">{order.email || user.email}</div>
          <div className="mt-4">
            <h3 className="font-semibold">Dirección de entrega</h3>
            {addr ? (
              <div className="text-sm text-gray-700">
                <div>{addr.full_name || 'Sin nombre'}</div>
                <div>
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ''}
                </div>
                <div>
                  {addr.city}
                  {addr.region ? `, ${addr.region}` : ''} {addr.postal_code || ''}
                </div>
                <div>{addr.country}</div>
                {addr.phone && <div>Tel: {addr.phone}</div>}
                {addr.is_default && (
                  <div className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                    Predeterminada
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No tienes dirección predeterminada.</div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-left">Precio</th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((it: any, idx: number) => (
              <tr key={idx} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {it.image_url && (
                      <Image
                        src={it.image_url}
                        alt={it.title || 'Producto'}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover"
                        unoptimized
                      />
                    )}
                    <div className="font-medium">{it.title}</div>
                  </div>
                </td>
                <td className="p-3">{it.quantity}</td>
                <td className="p-3">
                  {(it.unit_price_cents / 100).toLocaleString('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
