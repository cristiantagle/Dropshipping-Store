'use client';
import React from 'react';
import Link from 'next/link';

function readCount(): number {
  try {
    const raw = localStorage.getItem('carro') || '[]';
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function FloatingCart() {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    setCount(readCount());

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'carro') setCount(readCount());
    };
    const onCustom = () => setCount(readCount());

    window.addEventListener('storage', onStorage);
    window.addEventListener('carro:change', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('carro:change', onCustom as EventListener);
    };
  }, []);

  // Ocultar si 0 para no ensuciar visual
  const hidden = count <= 0;

  return (
    <div
      aria-hidden={hidden}
      className={`fixed z-50 right-4 bottom-4 md:right-6 md:bottom-6 transition-all duration-300 ${
        hidden ? 'translate-y-8 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <Link
        href="/carro"
        aria-label="Ver carro"
        className="group relative inline-flex items-center justify-center rounded-full h-14 w-14 md:h-16 md:w-16 shadow-lg ring-1 ring-black/5
                   bg-[#3eb489] hover:bg-[#36a178] active:scale-95 transition transform"
      >
        {/* Ícono carrito (SVG) */}
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-white">
          <path fill="currentColor"
            d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44A1.99 1.99 0 0 0 8 18h10v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12L10.1 14h6.45a2 2 0 0 0 1.8-1.11l3.24-6.49A1 1 0 0 0 20.7 5H6.21l-.94-2ZM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        </svg>
        {/* Badge */}
        <span className="absolute -top-1.5 -right-1.5 min-w-6 h-6 px-1 rounded-full bg-white text-[#14532d]
                         text-xs font-bold grid place-items-center shadow-md">
          {count}
        </span>
      </Link>
    </div>
  );
}
