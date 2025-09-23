#!/usr/bin/env bash
set -euo pipefail

BR="preview/ui-mini-pack-$(date +%Y%m%d-%H%M%S)"
echo "🎨 UI Mini-Pack (solo CSS, sin tocar TS/TSX)…"
echo "🌱 Rama: $BR"

# Asegura estado limpio y crea rama desde main remoto
git add -A >/dev/null 2>&1 || true
git checkout -B "$BR" origin/main

CSS_FILE="app/globals.css"
MARKER="/* === LUNARIA MINI-PACK SAFE 20250923 === */"

if grep -q "$MARKER" "$CSS_FILE"; then
  echo "ℹ️  Mini-pack ya estaba aplicado (marcador encontrado). No duplico."
else
  cat >> "$CSS_FILE" <<'EOF'
/* === LUNARIA MINI-PACK SAFE 20250923 === */
/* Ajustes muy suaves: tipografía, sombras, botones y hovers. Solo CSS. */

:root{
  --lnr-shadow-xs: 0 1px 3px rgba(15,23,42,.06);
  --lnr-shadow-sm: 0 4px 14px rgba(15,23,42,.07);
  --lnr-shadow-md: 0 10px 28px rgba(15,23,42,.10);
  --lnr-green: #16a34a;
  --lnr-green-700: #15803d;
}

/* Tipografía más consistente (ligero ajuste de tracking en títulos) */
h1,h2,.section-title{
  letter-spacing: -0.01em;
}

/* Elevación sutil por defecto y al hover para tiles existentes */
.grid .border.rounded-2xl,
.grid .rounded-2xl.border {
  box-shadow: var(--lnr-shadow-xs);
  transition: transform .22s cubic-bezier(.2,.7,.2,1), box-shadow .22s ease, filter .22s ease;
  background: #fff;
}
.grid .border.rounded-2xl:hover,
.grid .rounded-2xl.border:hover {
  transform: translateY(-2px);
  box-shadow: var(--lnr-shadow-sm);
}

/* Imágenes: zoom suave al hover del contenedor (sin cambiar el markup) */
.grid .border.rounded-2xl img,
.grid .rounded-2xl.border img {
  transition: transform .32s ease, filter .32s ease, opacity .2s ease;
  will-change: transform, filter;
}
.grid .border.rounded-2xl:hover img,
.grid .rounded-2xl.border:hover img {
  transform: scale(1.025);
  filter: saturate(1.04) contrast(1.02);
}

/* Botón “verde” coherente, sin romper utilidades existentes */
button.bg-lime-600,
a.bg-lime-600 {
  background-color: var(--lnr-green) !important;
  color: #fff !important;
  border-radius: .9rem !important;
  box-shadow: var(--lnr-shadow-sm);
  transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease;
}
button.bg-lime-600:hover,
a.bg-lime-600:hover {
  background-color: var(--lnr-green-700) !important;
  transform: translateY(-1px);
  box-shadow: var(--lnr-shadow-md);
}

/* Chips/badges suaves (mantiene tu look actual) */
.badge,
.badge-pill,
p.text-sm.text-gray-600 {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .2rem .6rem;
  border-radius: 999px;
  background: rgba(16,185,129,.08);
  color: #065f46;
  font-weight: 600;
}

/* Sombra y blur más sutil para barras pegadas que ya existen */
.sticky-header,
header.site-header,
.fixed.top-0.inset-x-0 {
  backdrop-filter: saturate(1.1) blur(6px);
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}

/* Botón back-to-top: asegura visibilidad y offset con el carrito flotante */
:where(.back-to-top, #backtotop, [data-backtotop], a[href="#top"]){
  z-index: 95 !important;
}
@media (min-width: 768px){
  :where(.back-to-top, #backtotop, [data-backtotop], a[href="#top"]){
    right: 6.5rem !important; /* evita solape con FloatingCart */
  }
}

/* Micro-animación de aparición para grids ya existentes */
.lunaria-grid-in > * {
  animation: lunaria-fade-in-up .28s ease both;
}
@keyframes lunaria-fade-in-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
/* === /LUNARIA MINI-PACK SAFE 20250923 === */
EOF
  echo "✍️  CSS mini-pack añadido a $CSS_FILE"
fi

git add "$CSS_FILE"
git commit -m "style(ui): mini-pack visual seguro (solo CSS): elevación, botones, hover, sombras"
git push -u origin "$BR"

echo "✅ Rama subida: $BR"
echo "➡ Revisa el preview en Vercel."
