#!/usr/bin/env bash
set -euo pipefail

BR="preview/fix-hero-parallax-$(date +%Y%m%d-%H%M%S)"
echo "🌄 Restaurando Hero con parallax (compatible con Topbar)…"
git fetch origin --prune
git checkout -B "$BR" origin/main || git checkout -b "$BR"

# 1) CSS de soporte para parallax (no rompe nada existente)
mkdir -p app
if ! grep -q "/* PARALLAX UTILITIES */" app/globals.css; then
  cat >> app/globals.css <<'CSS'

/* PARALLAX UTILITIES */
.parallax-root { perspective: 1000px; }
.parallax-scene { transform-style: preserve-3d; height: 100%; position: relative; }
.parallax-bg {
  position: absolute; inset: 0;
  background-position: center; background-size: cover; background-repeat: no-repeat;
  transform: translateZ(-300px) scale(1.35);
  will-change: transform;
  filter: saturate(105%) contrast(102%);
}
.parallax-fg { position: relative; z-index: 1; }
@media (min-width: 768px) {
  /* Fallback extra suave por si el navegador ignora 3D: */
  .parallax-bg-fixed { background-attachment: fixed; }
}
CSS
fi

# 2) Hero con parallax. Sustituimos el componente por una versión robusta.
mkdir -p components
cat > components/Hero.tsx <<'TSX'
'use client';
import Link from "next/link";

export default function Hero() {
  // Imagen hero: puedes cambiarla si quieres otro "mood"
  const bg = "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop')";
  return (
    <section className="relative h-[52vh] md:h-[64vh] lg:h-[68vh] overflow-hidden rounded-2xl bg-neutral-100">
      <div className="parallax-root">
        <div className="parallax-scene">
          <div
            className="parallax-bg parallax-bg-fixed"
            style={{ backgroundImage: bg }}
            aria-hidden="true"
          />
          <div className="parallax-fg relative h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-white/10" />
            <div className="relative z-10 h-full mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-start justify-end pb-10 md:pb-14">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 drop-shadow-sm">
                Descubre cosas útiles y bonitas
              </h1>
              <p className="mt-2 md:mt-3 text-neutral-700 max-w-xl">
                Productos prácticos, bien elegidos, con envío simple. Explora por categoría o mira lo nuevo.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/categorias"
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:bg-lime-700 transition"
                >
                  Explorar categorías
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold text-neutral-800 hover:bg-white transition"
                >
                  Ver novedades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
TSX

git add -A
git commit -m "fix(ui): restaura Hero con parallax (3D translateZ + fixed fallback) compatible con Topbar"
git push -u origin "$BR"

echo "✅ Preview listo en rama: $BR"
echo "👉 Pruébalo. Si te gusta, dime LUNARIA OK y te paso el run.sh de merge SOLO de este commit."
