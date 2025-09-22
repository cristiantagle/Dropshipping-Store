'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BackNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  if (pathname === '/') return null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
  }, [pathname]);

  const onClick = () => {
    if (canGoBack) router.back();
    else router.push('/categorias');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Volver"
      className="fixed top-20 left-4 z-[60] inline-flex items-center gap-2 rounded-full bg-lime-600 text-white px-4 py-2 shadow-lg hover:bg-lime-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="-ml-1">
        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="hidden sm:inline">Volver</span>
    </button>
  );
}
