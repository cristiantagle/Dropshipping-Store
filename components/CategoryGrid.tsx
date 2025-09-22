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
