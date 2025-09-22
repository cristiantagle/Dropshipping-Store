'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      role="navigation"
      aria-label="Barra superior"
      className={[
        "fixed top-0 inset-x-0 z-50 border-b transition-all duration-300",
        "backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white",
        scrolled ? "shadow-sm" : "shadow-none"
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-neutral-900 hover:opacity-80">
            <span className="inline-block rounded-md bg-emerald-600 text-white px-2 py-0.5 text-xs">LN</span>
            <span className="text-base">Lunaria</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/" className="text-neutral-700 hover:text-neutral-900 transition">Inicio</Link>
            <Link href="/categorias" className="text-neutral-700 hover:text-neutral-900 transition">Categorías</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/categorias" className="hidden md:inline-flex items-center rounded-full px-3 py-1.5 text-sm border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition">
              Explorar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
