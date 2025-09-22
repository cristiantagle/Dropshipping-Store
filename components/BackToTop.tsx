'use client';
import React from "react";
export default function BackToTop() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-6 bottom-28 z-[85] rounded-full bg-neutral-900 text-white w-11 h-11 shadow-lg hover:scale-105 active:scale-95 transition-transform">
      ↑
    </button>
  );
}
