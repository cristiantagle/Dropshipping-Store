'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      aria-label="Volver arriba"
      onClick={onClick}
      className={[
        "fixed left-4 bottom-4 z-[60]",
        "rounded-full px-4 py-2 text-sm font-medium",
        "bg-emerald-600 text-white shadow-lg",
        "hover:bg-emerald-700 active:scale-[0.98]",
        "transition-all duration-200",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      ].join(' ')}
    >
      ↑ Arriba
    </button>
  );
}
