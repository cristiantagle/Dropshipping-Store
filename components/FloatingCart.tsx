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
    window.addEventListener('storage', onStorage);
    // parche simple: refrescar al volver de otra pestaña
    const onFocus = () => setCount(readCount());
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="/carro"
        aria-label="Ir al carro"
        className="group relative inline-flex items-center gap-2 rounded-full px-4 py-3 text-white shadow-lg transition
                   bg-[var(--lunaria-green,#3eb489)] hover:bg-[var(--lunaria-green-hover,#36a178)]"
        prefetch
      >
        {/* Icono carrito */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3h2l.4 2M7 13h9l3-7H6.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="19" r="1.7"/>
          <circle cx="17" cy="19" r="1.7"/>
        </svg>
        <span className="text-sm font-semibold">Carro</span>
        {/* Badge */}
        
      </Link>
    </div>
  );
}
