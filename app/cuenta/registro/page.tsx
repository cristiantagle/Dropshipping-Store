'use client';
export const dynamic = 'force-dynamic';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseAuth } from '@/lib/supabase/authClient';

function RegisterInner() {
  const router = useRouter();
  const search = useSearchParams();
  const returnUrl = useMemo(() => {
    const raw = search?.get('return') || '/cuenta';
    if (typeof raw !== 'string') return '/cuenta';
    if (!raw.startsWith('/')) return '/cuenta';
    if (raw.startsWith('//')) return '/cuenta';
    if (raw.startsWith('/cuenta/login') || raw.startsWith('/cuenta/registro')) return '/cuenta';
    return raw;
  }, [search]);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabaseAuth.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Crear/actualizar perfil si ya existe sesión (según política de confirmación)
    const { data: userData } = await supabaseAuth.auth.getUser();
    if (userData.user && name.trim()) {
      await supabaseAuth
        .from('profiles')
        .upsert(
          { user_id: userData.user.id, display_name: name.trim() },
          { onConflict: 'user_id' },
        );
    }
    setMessage('Revisa tu correo para confirmar tu cuenta.');
    if (userData.user) {
      router.replace(returnUrl);
    } else {
      router.replace('/cuenta/login?return=' + encodeURIComponent(returnUrl));
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="password"
          placeholder="Contraseña (mín 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-lime-600 py-2 font-semibold text-white hover:bg-lime-700"
        >
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link
          href={{ pathname: '/cuenta/login', query: { return: returnUrl } }}
          className="text-lime-700 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-6 py-12">
          <p>Cargando...</p>
        </main>
      }
    >
      <RegisterInner />
    </Suspense>
  );
}
