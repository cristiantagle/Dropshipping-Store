'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAuth } from '@/lib/supabase/authClient';

type Order = {
  id: string;
  status: string;
  currency: string | null;
  total_cents: number;
  created_at: string;
};

export default function PedidosClient() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      const ret = encodeURIComponent(pathname || '/cuenta/pedidos');
      router.replace('/cuenta/login?return=' + ret);
    }
  }, [user, loading, router, pathname]);

  useEffect(() => {
    (async () => {
      if (!user) {
        setOrders([]);
        setBusy(false);
        return;
      }
      setBusy(true);
      const { data, error } = await supabaseAuth
        .from('orders')
        .select('id, status, currency, total_cents, created_at, user_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setOrders(data as any);
      setBusy(false);
    })();
  }, [user?.id]);

  if (loading || !user) return null;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold">Tus pedidos</h1>
      {busy && <div className="text-gray-600">Cargando...</div>}
      {!busy && orders.length === 0 && (
        <div className="rounded-xl border bg-white p-4 text-gray-600">Aún no tienes pedidos.</div>
      )}
      {!busy && orders.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Pedido</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3 font-mono text-xs">
                    <a href={`/cuenta/pedidos/${o.id}`} className="text-lime-700 hover:underline">
                      {o.id}
                    </a>
                  </td>
                  <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-3 capitalize">{o.status}</td>
                  <td className="p-3">
                    {(o.total_cents / 100).toLocaleString(undefined, {
                      style: 'currency',
                      currency: o.currency || 'CLP',
                    })}
                  </td>
                  <td className="p-3">
                    {o.status === 'pending' ? (
                      <button
                        className="rounded border px-3 py-1 text-xs hover:bg-gray-50"
                        onClick={async () => {
                          await supabaseAuth
                            .from('orders')
                            .update({ status: 'cancelled' })
                            .eq('id', o.id);
                          setOrders((prev) =>
                            prev.map((x) => (x.id === o.id ? { ...x, status: 'cancelled' } : x)),
                          );
                        }}
                      >
                        Cancelar
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
