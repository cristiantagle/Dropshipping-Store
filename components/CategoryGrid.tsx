// CategoryGrid.tsx — con iconos, overlay y alto contraste (compatible con LUNARIA ok)
"use client";
import React from "react";
import Link from "next/link";

// Tipado mínimo seguro respecto a lib/categorias.ts
type Cat = {
  slug: string;
  nombre: string;
  descripcion?: string;
  image_url?: string | null;
};

// Íconos por categoría (fallback a 🛍️)
const CAT_ICONS: Record<string, string> = {
  hogar: "🏠",
  belleza: "💄",
  tecnologia: "💻",
  eco: "🌿",
  mascotas: "🐾",
  bienestar: "💪",
};

// Imágenes representativas por categoría (fallback si no hay image_url)
const CAT_IMAGES: Record<string, string> = {
  hogar:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  belleza:
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  tecnologia:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  eco: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
  mascotas:
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  bienestar:
    "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop",
};

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

  if (!Array.isArray(cats) || cats.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="catgrid-title" className="mt-10">
      <h2 id="catgrid-title" className="sr-only">
        Explora por categorías
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cats.map((item) => {
          const slug = (item?.slug || "").toLowerCase().trim();
          const icon = CAT_ICONS[slug] ?? "🛍️";
          const bg =
            (item?.image_url && String(item.image_url).trim()) ||
            CAT_IMAGES[slug] ||
            CAT_IMAGES["bienestar"];

          return (
            <li key={slug}>
              <Link
                href={`/categorias/${slug}`}
                className="group block rounded-2xl overflow-hidden relative focus:outline-none focus:ring-4 focus:ring-lime-400"
              >
                <div
                  className="h-[180px] sm:h-[200px] w-full bg-center bg-cover"
                  style={{ backgroundImage: `url('${bg}')` }}
                  aria-hidden="true"
                />
                {/* Overlay de contraste */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 transition-all duration-300 group-hover:from-black/70 group-hover:via-black/40" />
                {/* Contenido */}
                <div className="absolute inset-0 p-4 flex items-end">
                  <div className="text-white drop-shadow [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                    <h3
                      className="flex items-center gap-2 text-lg font-semibold tracking-tight
                                   transition-transform duration-200 group-hover:-translate-y-0.5"
                    >
                      <span aria-hidden className="text-xl leading-none">
                        {icon}
                      </span>
                      {item?.nombre ?? slug}
                    </h3>
                    {item?.descripcion ? (
                      <p className="mt-1 text-xs sm:text-sm text-white/90 line-clamp-2">
                        {item.descripcion}
                      </p>
                    ) : null}
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
