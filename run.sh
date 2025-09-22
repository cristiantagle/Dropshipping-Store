#!/usr/bin/env bash
set -euo pipefail

BR="preview/fix-hero-link-and-imgs-$(date +%Y%m%d-%H%M%S)"
echo "🔧 Arreglando Hero→/categorias y endureciendo imágenes (fallback)…"
git fetch origin --prune
git checkout -B "$BR" origin/main || git checkout -b "$BR"

# 1) Hero: Link directo a /categorias (sin onClick que rompa)
cat > components/Hero.tsx <<'TSX'
'use client';
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-50 to-emerald-50 border p-6 sm:p-10 mb-8">
      <div className="max-w-2xl space-y-4">
        <h1 className="font-black text-3xl sm:text-4xl tracking-tight">
          Encuentra cosas útiles y bonitas para tu día a día
        </h1>
        <p className="text-neutral-600">
          Descubre categorías curadas con productos que funcionan de verdad.
        </p>
        <div className="flex gap-3">
          <Link
            href="/categorias"
            prefetch={false}
            className="inline-flex items-center justify-center rounded-xl bg-lime-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-lime-700 transition"
          >
            Explorar categorías
          </Link>
          <a
            href="#tendencias"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 font-semibold hover:bg-white/60 transition"
          >
            Ver tendencias
          </a>
        </div>
      </div>
    </section>
  );
}
TSX

# 2) CategoryGrid: pickUrl + fallback, sin suposiciones peligrosas
cat > components/CategoryGrid.tsx <<'TSX'
'use client';
import Link from "next/link";

type Cat = { slug: string; nombre: string; descripcion?: string; image_url?: string | null };

const CAT_IMAGES: Record<string,string> = {
  hogar: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  belleza: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  tecnologia: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  eco: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
  mascotas: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  bienestar: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop",
};

const FALLBACK = "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickUrl(c: Cat): string {
  const cand = (c.image_url ?? CAT_IMAGES[c.slug] ?? "").toString().trim();
  return cand || FALLBACK;
}

function readCategoriasSafely(): Cat[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@/lib/categorias");
    if (mod?.getAllCategorias && typeof mod.getAllCategorias === "function") {
      return (mod.getAllCategorias() ?? []) as Cat[];
    }
    if (Array.isArray(mod?.CATEGORIAS)) {
      return (mod.CATEGORIAS ?? []) as Cat[];
    }
  } catch {}
  return [];
}

export default function CategoryGrid() {
  const cats = readCategoriasSafely();

  if (!cats.length) {
    return (
      <div className="text-sm text-neutral-600">
        No hay categorías disponibles por ahora.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cats.map((c) => {
        const src = pickUrl(c);
        return (
          <li key={c.slug} className="group relative overflow-hidden rounded-2xl border bg-white hover:shadow-md transition">
            <Link href={`/categorias/${c.slug}`} className="block">
              <div className="relative aspect-[4/3] bg-neutral-100">
                <img
                  src={src}
                  alt={c.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.dataset.fallbackApplied !== "1") {
                      img.dataset.fallbackApplied = "1";
                      img.src = FALLBACK;
                    }
                  }}
                />
                <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-lime-600/95 text-white px-3 py-1.5 text-sm font-semibold shadow-sm">
                  {c.nombre}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
TSX

# 3) ProductListClient: robustecer fallback (por si la “banda elástica” viene con URL caída)
cat > components/ProductListClient.tsx <<'TSX'
'use client';
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria?: string | null;
  categoria_slug?: string | null;
};

type Props = { items: Producto[] };

const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickUrl(p: Producto): string {
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image];
  const first = cands.find((v) => typeof v === "string" && v.trim().length > 0);
  return (first ?? "").toString().trim();
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

export default function ProductListClient({ items }: Props) {
  const data = Array.isArray(items) ? items : [];
  if (data.length === 0) {
    return (
      <p className="text-gray-600">
        No hay productos disponibles en esta categoría por ahora.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((p) => {
        let src = pickUrl(p);
        if (!src && p.categoria_slug === "bienestar") {
          src = FALLBACK;
        }
        const onErr: React.ReactEventHandler<HTMLImageElement> = (e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.dataset.fallbackApplied !== "1") {
            img.dataset.fallbackApplied = "1";
            img.src = FALLBACK;
          }
        };
        return (
          <li key={p.id} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <div className="aspect-[4/3] w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={src || FALLBACK}
                alt={p.nombre || "Producto"}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={onErr}
              />
            </div>
            <h3 className="font-semibold">{p.nombre}</h3>
            <p className="text-sm text-gray-600">{p.envio || "Envío estándar"}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold">{fmtCLP(p.precio ?? null)}</span>
              <button
                className="px-3 py-1 rounded-xl bg-black text-white text-sm"
                onClick={() => alert(`Agregado: ${p.nombre}`)}
              >
                Agregar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
TSX

git add -A
git commit -m "fix(ui): Hero→/categorias estable; CategoryGrid/ProductList con fallback de imágenes y guards"
git push -u origin "$BR"

echo "✅ Preview listo: $BR"
echo "👉 Revisa. Si todo bien: di LUNARIA OK y te paso el script de merge (SOLO este commit)."
