#!/usr/bin/env bash
set -euo pipefail

echo "=== Escribiendo archivos (Home UI polish, seguro con Supabase) ==="

# app/page.tsx
cat > app/page.tsx <<'TSX'
import "server-only";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProductSkeleton from "@/components/ProductSkeleton";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  categoria_slug?: string | null;
  destacado?: boolean | null;
  created_at?: string | null;
  ventas?: number | null;
};

const SELECT_COLS =
  "id,nombre,precio,imagen,imagen_url,image_url,image,envio,categoria_slug,destacado,created_at,ventas";

const MOCKS = [
  { id: "m1", nombre: "Organizador minimal", imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  { id: "m2", nombre: "Botella térmica", imagen: "https://images.unsplash.com/photo-1502741126161-b048400d085a?q=80&w=1200&auto=format&fit=crop" },
  { id: "m3", nombre: "Auriculares", imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  { id: "m4", nombre: "Silla ergonómica", imagen: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" },
  { id: "m5", nombre: "Lámpara cálida", imagen: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop" },
  { id: "m6", nombre: "Mochila urbana", imagen: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" }
];

const IMG_FALLBACK = "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickImg(p: Partial<Producto> & {
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
}) {
  const toStr = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image].map(toStr).filter(Boolean);
  return cands[0] || IMG_FALLBACK;
}

function fmtCLP(v?: number | null) {
  if (v == null) return "$—";
  try {
    return Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `$${v}`;
  }
}

function ProductTile({ item }: { item: Producto }) {
  const src = pickImg(item);
  const onErr: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied !== "1") {
      img.dataset.fallbackApplied = "1";
      img.src = IMG_FALLBACK;
    }
  };
  return (
    <li className="rounded-2xl border overflow-hidden bg-white group card-3d">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={src}
          alt={item.nombre ?? "Producto"}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={onErr}
        />
      </div>
      <div className="p-3">
        <div className="lunaria-title text-sm line-clamp-1">{item.nombre}</div>
        <div className="mt-1 flex items-center justify-between">
          <span className="lunaria-price text-sm">{fmtCLP(item.precio ?? null)}</span>
          {item.envio ? (
            <span className="badge text-[11px]">{item.envio}</span>
          ) : (
            <span className="badge text-[11px]">Envío estándar</span>
          )}
        </div>
        <div className="lunaria-divider" />
        <button
          type="button"
          className="lunaria-cta w-full py-2 text-sm font-semibold"
          onClick={() => alert(`Agregado: ${item.nombre}`)}
        >
          Agregar al carrito
        </button>
      </div>
    </li>
  );
}

async function getHomeData() {
  try {
    const supa = supabaseServer();
    if (!supa) {
      return { destacados: [] as Producto[], nuevos: [] as Producto[], top: [] as Producto[] };
    }

    // destacados
    let destacados: Producto[] = [];
    try {
      const { data } = await supa
        .from("productos")
        .select(SELECT_COLS)
        .eq("destacado", true)
        .order("id", { ascending: true })
        .limit(6);
      destacados = (data ?? []) as Producto[];
    } catch (e) {
      console.error("Supabase destacados:", e);
      destacados = [];
    }

    // nuevos
    let nuevos: Producto[] = [];
    try {
      const r1 = await supa
        .from("productos")
        .select(SELECT_COLS)
        .order("created_at", { ascending: false })
        .limit(6);
      nuevos = (r1.data ?? []) as Producto[];
      if (nuevos.length === 0) {
        const r2 = await supa
          .from("productos")
          .select(SELECT_COLS)
          .order("id", { ascending: false })
          .limit(6);
        nuevos = (r2.data ?? []) as Producto[];
      }
    } catch (e) {
      console.error("Supabase nuevos:", e);
      nuevos = [];
    }

    // top
    let top: Producto[] = [];
    try {
      const r1 = await supa
        .from("productos")
        .select(SELECT_COLS)
        .order("ventas", { ascending: false })
        .limit(6);
      top = (r1.data ?? []) as Producto[];
      if (top.length === 0) {
        const r2 = await supa
          .from("productos")
          .select(SELECT_COLS)
          .order("id", { ascending: true })
          .limit(6);
        top = (r2.data ?? []) as Producto[];
      }
    } catch (e) {
      console.error("Supabase top:", e);
      top = [];
    }

    return { destacados, nuevos, top };
  } catch (e) {
    console.error("getHomeData fatal:", e);
    return { destacados: [] as Producto[], nuevos: [] as Producto[], top: [] as Producto[] };
  }
}

export default async function Home() {
  const { destacados, nuevos, top } = await getHomeData();

  return (
    <main className="space-y-12">
      <Hero />

      {/* NUEVOS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <SectionHeader
            title="Nuevos"
            subtitle="Lo último que estamos destacando en la tienda"
            className="mb-0"
          />
          <Link href="/categorias" className="text-sm font-semibold rounded-xl px-3 py-1.5 hover:bg-neutral-100">
            Ver categorías →
          </Link>
        </div>

        {nuevos.length > 0 ? (
          <ul className="lunaria-grid-in grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {nuevos.map((m) => <ProductTile key={m.id} item={m} />)}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MOCKS.slice(0,6).map((m) => (
              <li key={m.id} className="rounded-2xl border overflow-hidden bg-white group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* TENDENCIAS (destacados) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="Tendencias" subtitle="Se mueven mucho estos días" />
        {destacados.length > 0 ? (
          <ul className="lunaria-grid-in grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {destacados.map((m) => <ProductTile key={m.id} item={m} />)}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}><ProductSkeleton /></li>
            ))}
          </ul>
        )}
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
        {top.length > 0 ? (
          <ul className="lunaria-grid-in grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {top.map((m) => <ProductTile key={m.id} item={m} />)}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}><ProductSkeleton /></li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
TSX

# components/Hero.tsx
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
              <p className="mt-2 md:mt-3 text-neutral-700 max-w-xl lunaria-hero-subtle">
                Productos prácticos, bien elegidos, con envío simple. Explora por categoría o mira lo nuevo.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/categorias"
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:bg-lime-700 transition lunaria-cta hero-cta-breathe"
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

echo "✅ Archivos escritos."
