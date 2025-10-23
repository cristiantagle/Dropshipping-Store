'use client';
export const dynamic = 'force-dynamic';
import { Suspense, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseAuth } from '@/lib/supabase/authClient';
import { useAuth } from '@/contexts/AuthContext';

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { user } = useAuth();
  const returnUrl = useMemo(() => {
    const raw = search?.get('return') || '/cuenta';
    if (typeof raw !== 'string') return '/cuenta';
    if (!raw.startsWith('/')) return '/cuenta';
    if (raw.startsWith('//')) return '/cuenta';
    // Avoid loops: do not return to login/registro
    if (raw.startsWith('/cuenta/login') || raw.startsWith('/cuenta/registro')) return '/cuenta';
    return raw;
  }, [search]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    router.replace(returnUrl);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabaseAuth.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace(returnUrl);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-4">
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
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-lime-600 py-2 font-semibold text-white hover:bg-lime-700"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link
          href={{ pathname: '/cuenta/registro', query: { return: returnUrl } }}
          className="text-lime-700 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-6 py-12">
          <p>Cargando...</p>
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
