'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAuth } from '@/lib/supabase/authClient';

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

export default function DireccionesClient() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/cuenta/login');
  }, [user, loading, router]);

  async function load() {
    if (!user) {
      setItems([]);
      return;
    }
    const { data } = await supabaseAuth
      .from('user_addresses')
      .select('*')
      .order('is_default', { ascending: false });
    setItems((data || []) as any);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function saveAddress() {
    setBusy(true);
    const payload: any = { ...form };
    delete payload.id;
    if (form.id) {
      await supabaseAuth.from('user_addresses').update(payload).eq('id', form.id);
    } else {
      await supabaseAuth.from('user_addresses').insert(payload);
    }
    setForm(empty);
    await load();
    setBusy(false);
  }

  async function setDefault(id: string) {
    setBusy(true);
    const { error: rpcError } = await supabaseAuth.rpc('set_default_address', { addr_id: id });
    if (rpcError) {
      const { data } = await supabaseAuth.from('user_addresses').select('id');
      for (const a of (data || []) as any[]) {
        await supabaseAuth
          .from('user_addresses')
          .update({ is_default: a.id === id })
          .eq('id', a.id);
      }
    }
    await load();
    setBusy(false);
  }

  async function remove(id: string) {
    setBusy(true);
    await supabaseAuth.from('user_addresses').delete().eq('id', id);
    await load();
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold">Tus direcciones</h1>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 font-semibold">Agregar/editar</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            className="rounded border px-3 py-2"
            placeholder="Nombre"
            value={form.full_name || ''}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Teléfono"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 md:col-span-2"
            placeholder="Dirección (línea 1)"
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 md:col-span-2"
            placeholder="Dirección (línea 2)"
            value={form.line2 || ''}
            onChange={(e) => setForm({ ...form, line2: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Ciudad"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Región"
            value={form.region || ''}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Código postal"
            value={form.postal_code || ''}
            onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="País"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
            />
            Predeterminada
          </label>
          <div className="md:col-span-2">
            <button
              className="rounded-lg bg-lime-600 px-4 py-2 text-white hover:bg-lime-700"
              onClick={saveAddress}
              disabled={busy || !form.line1 || !form.city || !form.country}
            >
              {form.id ? 'Guardar cambios' : 'Agregar dirección'}
            </button>
            {form.id && (
              <button
                className="ml-2 rounded-lg border px-4 py-2"
                onClick={() => setForm(empty)}
                disabled={busy}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 font-semibold">Guardadas</h2>
        <div className="grid gap-3">
          {items.map((a) => (
            <div key={a.id} className="flex items-start justify-between rounded border p-3">
              <div>
                <div className="font-semibold">{a.full_name || 'Sin nombre'}</div>
                <div className="text-gray-700">
                  {a.line1}
                  {a.line2 ? ', ' + a.line2 : ''}
                </div>
                <div className="text-gray-700">
                  {a.city}
                  {a.region ? ', ' + a.region : ''} {a.postal_code || ''}
                </div>
                <div className="text-gray-700">{a.country}</div>
                {a.phone && <div className="text-gray-700">{a.phone}</div>}
                {a.is_default && (
                  <span className="mt-1 inline-block rounded bg-lime-100 px-2 py-0.5 text-xs text-lime-700">
                    Predeterminada
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setForm(a)}
                  disabled={busy}
                >
                  Editar
                </button>
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setDefault(a.id)}
                  disabled={busy || a.is_default}
                >
                  Hacer predeterminada
                </button>
                <button
                  className="rounded border px-3 py-1 text-red-600"
                  onClick={() => remove(a.id)}
                  disabled={busy}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-gray-600">No tienes direcciones aún.</div>}
        </div>
      </div>
    </main>
  );
}
