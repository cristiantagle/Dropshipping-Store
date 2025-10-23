'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountClient() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut, profile, updateProfile } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      const ret = encodeURIComponent(pathname || '/cuenta');
      router.replace('/cuenta/login?return=' + ret);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-gray-600">Cargando...</p>
      </main>
    );
  }

  if (!user) return null;

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName((profile?.display_name || '') as string);
    setAvatarUrl((profile?.avatar_url || '') as string);
  }, [profile?.display_name, profile?.avatar_url]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold">Tu cuenta</h1>
      <div className="space-y-2 rounded-xl border bg-white p-6">
        <div>
          <span className="text-gray-600">Email:</span> {user.email}
        </div>
        <div>
          <span className="text-gray-600">ID:</span> {user.id}
        </div>
      </div>
      <div className="mt-6 space-y-4 rounded-xl border bg-white p-6">
        <h2 className="font-semibold">Perfil</h2>
        <div className="grid max-w-md gap-3">
          <label className="block">
            <span className="text-sm text-gray-600">Nombre para mostrar</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Avatar URL</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </label>
          <button
            onClick={async () => {
              setSaving(true);
              const { error } = await updateProfile({
                display_name: displayName,
                avatar_url: avatarUrl,
              });
              setSaving(false);
            }}
            className="w-fit rounded-lg bg-lime-600 px-4 py-2 text-white hover:bg-lime-700"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
      <button
        onClick={async () => {
          await signOut();
          router.replace('/');
        }}
        className="mt-6 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
      >
        Cerrar sesión
      </button>
    </main>
  );
}
