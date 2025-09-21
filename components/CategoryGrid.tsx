'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";

type Cat = { slug: string; nombre: string; descripcion?: string; image_url?: string };

const ICONS: Record<string, string> = {
  hogar: "🏠",
  belleza: "💄",
  tecnologia: "💻",
  eco: "🌱",
  mascotas: "🐾",
  bienestar: "🧘",
};

// Fallbacks por slug (no sustituye si lib/categorias provee image_url)
const CAT_IMAGES: Record<string, string> = {
  hogar: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  belleza: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  tecnologia: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  eco: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
  mascotas: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  bienestar: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop",
};

function readCategoriasSafely(): Cat[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@/lib/categorias");
    if (Array.isArray(mod?.CATEGORIAS)) return mod.CATEGORIAS as Cat[];
    if (typeof mod?.getAllCategorias === "function") return (mod.getAllCategorias() ?? []) as Cat[];
  } catch {}
  return [
    { slug: "hogar", nombre: "Hogar" },
    { slug: "belleza", nombre: "Belleza" },
    { slug: "tecnologia", nombre: "Tecnología" },
    { slug: "bienestar", nombre: "Bienestar" },
    { slug: "eco", nombre: "Eco" },
    { slug: "mascotas", nombre: "Mascotas" },
  ];
}

export default function CategoryGrid() {
  const cats = readCategoriasSafely();

  return (
    <section className="lnr-appear">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Explora por categoría</h2>
        <Link href="/categorias" className="btn-brand">Ver todas</Link>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cats.map((c, i) => {
          const icon = ICONS[c.slug] ?? "🛍️";
          const src = (c as any).image_url || CAT_IMAGES[c.slug] || CAT_IMAGES["hogar"];
          return (
            <li key={c.slug} className="group lnr-appear lnr-appear-delay"
                style={{ animationDelay: `${0.03 * i + 0.05}s` }}>
              <Link href={`/categorias/${c.slug}`}
                    className="block rounded-2xl overflow-hidden relative card-3d bg-gray-100 ring-1 ring-black/5">
                <div className="relative aspect-[4/3]">
                  {/* usamos <img> para no depender de remotePatterns adicionales */}
                  <img src={src} alt={c.nombre}
                       className="w-full h-full object-cover img-zoom" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 lnr-overlay-grad" />
                  <div className="absolute bottom-2 left-2">
                    <span className="cat-chip shadow-lg">
                      <span className="text-lg leading-none">{icon}</span>
                      <span className="font-semibold whitespace-nowrap">{c.nombre}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
