#!/usr/bin/env bash
set -euo pipefail

echo "🎁 Mini-pack UI: Topbar search + Footer links + Home sections (skeletons) …"
TS="$(date +%Y%m%d-%H%M%S)"
BR="preview/ui-mini-pack-${TS}"

# 1) Base desde main
git fetch origin --prune
git checkout main
git pull --ff-only
git checkout -b "${BR}"

# 2) components/SearchBar.tsx (nuevo, client)
cat > components/SearchBar.tsx <<'TSX'
'use client';
import React from "react";

type Props = {
  className?: string;
  onSubmit?: (q: string) => void;
  placeholder?: string;
};

export default function SearchBar({ className = "", onSubmit, placeholder = "Buscar productos…" }: Props) {
  const [q, setQ] = React.useState("");
  function submit() {
    (onSubmit ?? ((val) => alert(`(Demo) Buscar: ${val}`)))(q.trim());
  }
  return (
    <div className={`relative flex items-center ${className}`} role="search">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        aria-label="Buscar"
        placeholder={placeholder}
        className="w-full md:w-72 rounded-xl border px-3.5 py-2 pr-9 text-sm bg-white/90 shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
      />
      <button
        type="button"
        onClick={submit}
        aria-label="Buscar"
        className="absolute right-1.5 inline-flex items-center justify-center size-8 rounded-lg hover:bg-neutral-100"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
TSX

# 3) components/TopBar.tsx (actualizar para incluir SearchBar; respeta BackButton y enlaces)
cat > components/TopBar.tsx <<'TSX'
'use client';
import Link from "next/link";
import BackButton from "./BackButton";
import SearchBar from "./SearchBar";

export default function TopBar() {
  return (
    <>
      <div className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-16 grid grid-cols-12 items-center gap-3">
            {/* Izquierda: Volver */}
            <div className="col-span-4 sm:col-span-3">
              <BackButton className="hidden sm:inline-flex" />
            </div>

            {/* Centro: Logo + nombre */}
            <div className="col-span-4 sm:col-span-3 justify-self-center">
              <Link href="/" className="shrink-0 inline-flex items-center gap-2 group">
                <div className="size-8 rounded-lg bg-lime-600 text-white grid place-items-center shadow-sm group-hover:scale-[1.03] transition">
                  <span className="font-black">L</span>
                </div>
                <div className="leading-tight hidden sm:block">
                  <div className="font-extrabold tracking-tight">Lunaria</div>
                  <div className="text-xs text-neutral-500 -mt-0.5">Tienda simple y bonita</div>
                </div>
              </Link>
            </div>

            {/* Derecha: Search + Nav mínima */}
            <div className="col-span-4 sm:col-span-6 flex items-center justify-end gap-2">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <Link
                href="/categorias"
                className="hidden sm:inline-flex rounded-xl px-3 py-2 text-sm font-semibold hover:bg-neutral-100 transition"
              >
                Categorías
              </Link>
              <button
                type="button"
                onClick={() => alert('Pronto: login/usuario')}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-white/60 transition"
                aria-label="Iniciar sesión"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM3 22a9 9 0 1118 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">Entrar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* separador para que el contenido no quede bajo la barra */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
TSX

# 4) components/Footer.tsx (enlaces útiles; componente existe ahora en main)
cat > components/Footer.tsx <<'TSX'
'use client';
import Link from "next/link";

export default function Footer(){
  return (
    <footer className="mt-16 border-t bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <div className="size-8 rounded-lg bg-lime-600 text-white grid place-items-center shadow-sm">
              <span className="font-black">L</span>
            </div>
            <span className="font-extrabold tracking-tight">Lunaria</span>
          </div>
          <p className="mt-3 text-sm text-neutral-600">Cosas útiles y bonitas. Envíos simples.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Tienda</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li><Link className="hover:underline" href="/categorias">Categorías</Link></li>
            <li><a className="hover:underline" href="#">Novedades</a></li>
            <li><a className="hover:underline" href="#">Ofertas</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Soporte</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li><a className="hover:underline" href="#">Contacto</a></li>
            <li><a className="hover:underline" href="#">Envíos y devoluciones</a></li>
            <li><a className="hover:underline" href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li><a className="hover:underline" href="#">Términos</a></li>
            <li><a className="hover:underline" href="#">Privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-neutral-500">
          © <span>{new Date().getFullYear()}</span> Lunaria — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
TSX

# 5) components/ProductSkeleton.tsx (para home; liviano)
cat > components/ProductSkeleton.tsx <<'TSX'
'use client';
export default function ProductSkeleton(){
  return (
    <div className="rounded-xl border overflow-hidden bg-white">
      <div className="aspect-[4/3] bg-gray-100 skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 bg-gray-200 rounded skeleton" />
        <div className="h-3 w-1/2 bg-gray-200 rounded skeleton" />
        <div className="h-8 w-24 bg-gray-200 rounded-lg skeleton" />
      </div>
    </div>
  );
}
TSX

# 6) components/SectionHeader.tsx (título + subtítulo)
cat > components/SectionHeader.tsx <<'TSX'
'use client';
type Props = { title: string; subtitle?: string; className?: string };
export default function SectionHeader({ title, subtitle, className="" }: Props){
  return (
    <header className={`mb-4 ${className}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-sub mt-1">{subtitle}</p> : null}
    </header>
  );
}
TSX

# 7) app/page.tsx (Home): añadimos bloques con skeletons + algunos mocks (no lógica externa)
cat > app/page.tsx <<'TSX'
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProductSkeleton from "@/components/ProductSkeleton";
import Link from "next/link";

const MOCKS = [
  { id: "m1", nombre: "Organizador minimal", imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  { id: "m2", nombre: "Botella térmica", imagen: "https://images.unsplash.com/photo-1502741126161-b048400d085a?q=80&w=1200&auto=format&fit=crop" },
  { id: "m3", nombre: "Auriculares", imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  { id: "m4", nombre: "Silla ergonómica", imagen: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" },
  { id: "m5", nombre: "Lámpara cálida", imagen: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop" },
  { id: "m6", nombre: "Mochila urbana", imagen: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" }
];

export default function Home() {
  return (
    <main className="space-y-12">
      <Hero />

      {/* NUEVOS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Nuevos"
          subtitle="Lo último que estamos destacando en la tienda"
        />
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOCKS.slice(0,6).map((m) => (
            <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* TENDENCIAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Tendencias"
          subtitle="Se mueven mucho estos días"
        />
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}><ProductSkeleton /></li>
          ))}
        </ul>
      </section>

      {/* TOP VENTAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <SectionHeader
            title="Top Ventas"
            subtitle="Los favoritos de la comunidad"
            className="mb-0"
          />
          <Link href="/categorias" className="text-sm font-semibold rounded-xl px-3 py-1.5 hover:bg-neutral-100">
            Ver todas las categorías →
          </Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}><ProductSkeleton /></li>
          ))}
        </ul>
      </section>
    </main>
  );
}
TSX

# 8) Commit & push
git add -A
git commit -m "feat(ui): Topbar search (placeholder) + Footer links + Home sections (skeletons/mocks) — mini-pack"
git push -u origin "${BR}"

echo "✅ Rama ${BR} lista. Revisa el preview en Vercel."
