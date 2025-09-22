'use client';

import React from 'react';
import Link from 'next/link';

type Item = {
  id: string;
  nombre?: string;
  precio?: number;
  imagen?: string;
  imagen_url?: string;
  image_url?: string;
  image?: string;
  [k: string]: unknown;
};

function readCart(): Item[] {
  try {
    const raw = localStorage.getItem('carro') || '[]';
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function FloatingCart() {
  const [count, setCount] = React.useState<number>(0);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // Inicial
    setCount(readCart().length);

    // Escuchar cambios del propio sitio
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'carro') setCount(readCart().length);
    };
    window.addEventListener('storage', onStorage);

    // Parche local: interceptar writes a localStorage.setItem dentro de la misma pestaña
    const _setItem = localStorage.setItem;
    localStorage.setItem = function (key: string, value: string) {
      _setItem.apply(this, [key, value]);
      if (key === 'carro') {
        try { setCount(JSON.parse(value)?.length ?? 0); } catch {}
      }
    } as typeof localStorage.setItem;

    return () => {
      window.removeEventListener('storage', onStorage);
      localStorage.setItem = _setItem;
    };
  }, []);

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          className="group relative rounded-full shadow-lg hover:shadow-xl transition
                     bg-lime-600 text-white w-14 h-14 flex items-center justify-center"
          aria-label="Abrir carro"
        >
          {/* ícono simple */}
          <svg width="24" height="24" viewBox="0 0 24 24" className="opacity-90">
            <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.41c-.18.32-.25.68-.2 1.03.11.74.76 1.31 1.51 1.31h9v-2h-8.42c-.09 0-.17-.05-.21-.13l.03-.06L12.1 16h5.45c.57 0 1.08-.32 1.34-.83L22 9H6.42l-.75-1.5L5.2 6h1.8V4z" fill="currentColor"/>
          </svg>

          {/* badge con cantidad */}
          <span className="absolute -top-1 -right-1 rounded-full text-[10px] px-1.5 py-0.5
                           bg-black text-white border border-white">
            {count}
          </span>
        </button>
      </div>

      {/* Mini panel simple */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-w-[92vw] rounded-2xl bg-white shadow-2xl border">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-semibold">Tu carro</h3>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-black">Cerrar</button>
          </div>
          <div className="p-3 text-sm text-gray-600">
            {count === 0 ? (
              <p>Tu carro está vacío.</p>
            ) : (
              <p>Tienes <b>{count}</b> {count === 1 ? 'producto' : 'productos'} en el carro.</p>
            )}
          </div>
          <div className="p-3 border-t">
            <Link
              href="/carro"
              className="block w-full text-center rounded-xl bg-lime-600 text-white py-2 hover:bg-lime-700 transition"
              onClick={() => setOpen(false)}
            >
              Ir al carro
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
