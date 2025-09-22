#!/usr/bin/env bash
set -euo pipefail

BR="preview/tune-hero-parallax-$(date +%Y%m%d-%H%M%S)"
echo "🎯 Suavizando parallax del Hero (menos profundidad, mejor encuadre, móvil sin 3D)…"
git fetch origin --prune
git checkout -B "$BR" origin/main || git checkout -b "$BR"

# 1) Ajustes CSS de parallax (menor profundidad/escala, mejor overlay, mobile fallback)
mkdir -p app
if ! grep -q "/* PARALLAX UTILITIES v2 */" app/globals.css; then
  cat >> app/globals.css <<'CSS'

/* PARALLAX UTILITIES v2 */
.parallax-root { perspective: 800px; }
.parallax-scene { transform-style: preserve-3d; height: 100%; position: relative; }
.parallax-bg {
  position: absolute; inset: 0;
  background-position: center 30%;
  background-size: cover;
  background-repeat: no-repeat;
  transform: translateZ(-120px) scale(1.12);
  will-change: transform;
  transition: transform 300ms ease-out;
  filter: saturate(104%) contrast(102%);
}
/* Suaviza bordes y da respiro visual */
.hero-clip { border-radius: 1rem; overflow: hidden; }
/* Degradado más sutil (menos “leche” sobre la foto) */
.hero-fade::after{
  content:"";
  position:absolute; inset:0;
  background: linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.15) 100%);
  pointer-events:none;
}
/* En móviles desactivamos 3D: se ve más limpio */
@media (max-width: 767px) {
  .parallax-root { perspective: none; }
  .parallax-scene { transform-style: flat; }
  .parallax-bg { transform: none; }
  .parallax-bg-fixed { background-attachment: scroll; }
}
/* Respeto a usuarios con reduce-motion */
@media (prefers-reduced-motion: reduce) {
  .parallax-bg { transition: none; transform: none; }
}
CSS
fi

# 2) Hero con parallax suavizado y encuadre mejorado (compat con Topbar)
mkdir -p components
cat > components/Hero.tsx <<'TSX'
'use client';
import Link from "next/link";

export default function Hero() {
  const bg = "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop')";
  return (
    <section className="relative hero-clip h-[50vh] md:h-[62vh] lg:h-[66vh] bg-neutral-100">
      <div className="parallax-root h-full">
        <div className="parallax-scene">
          <div
            className="parallax-bg parallax-bg-fixed"
            style={{ backgroundImage: bg }}
            aria-hidden="true"
          />
          <div className="parallax-fg relative h-full hero-fade">
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
git commit -m "style(hero): parallax suavizado (menos profundidad), mejor encuadre y mobile fallback; overlay refinado"
git push -u origin "$BR"

echo "✅ Preview listo en rama: $BR"
echo "👉 Si te gusta, dime LUNARIA OK y te paso el run.sh de merge SOLO de este commit."
