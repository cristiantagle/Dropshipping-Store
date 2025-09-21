"use client";
import Link from "next/link";

type Cat = {
  slug: string;
  nombre: string;
  descripcion?: string;
  image_url?: string | null;
  id?: string;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

const CAT_IMAGES: Record<string, string> = {
  hogar:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  belleza:
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  tecnologia:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  eco:
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
  mascotas:
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  bienestar:
    "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop",
};

// Iconos inline (sin dependencias)
function CatIcon({ slug }: { slug: string }) {
  const cls = "w-5 h-5";
  switch (slug) {
    case "hogar":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 10.5L12 4l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" strokeWidth="1.5"/>
        </svg>
      );
    case "belleza":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 3v6M9 6h6M8 13a4 4 0 0 0 8 0v-1H8v1z" strokeWidth="1.5"/>
        </svg>
      );
    case "tecnologia":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5"/>
          <path d="M8 21h8" strokeWidth="1.5"/>
        </svg>
      );
    case "eco":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 21c4-2 7-6 7-10a7 7 0 0 0-7-7c0 4-3 8-7 10 2 3 4 5 7 7z" strokeWidth="1.5"/>
        </svg>
      );
    case "mascotas":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="6" cy="8" r="2" strokeWidth="1.5"/>
          <circle cx="12" cy="6" r="2" strokeWidth="1.5"/>
          <circle cx="18" cy="8" r="2" strokeWidth="1.5"/>
          <path d="M6 16c2.5-2 9.5-2 12 0 1.2 1 1 3-1 3H7c-2 0-2.2-2  -1-3z" strokeWidth="1.5"/>
        </svg>
      );
    case "bienestar":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 8a4 4 0 1 1 0 8M4 12h16" strokeWidth="1.5"/>
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
        </svg>
      );
  }
}

function readCategoriasSafely(): Cat[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@/lib/categorias");
    if (Array.isArray(mod?.CATEGORIAS)) {
      return mod.CATEGORIAS as Cat[];
    }
    if (typeof mod?.getAllCategorias === "function") {
      return (mod.getAllCategorias() ?? []) as Cat[];
    }
  } catch {}
  return [];
}

export default function CategoryGrid() {
  const cats = readCategoriasSafely();

  return (
    <section id="categorias" className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Categorías</h2>
        <Link href="/categorias" className="text-emerald-700 hover:text-emerald-800 text-sm font-semibold">
          Ver todas →
        </Link>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cats.map((c) => {
          const src = (c.image_url && c.image_url.trim()) || CAT_IMAGES[c.slug] || FALLBACK;
          return (
            <li key={c.slug}>
              <Link
                href={`/categorias/${c.slug}`}
                className="group block relative overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={src}
                    alt={c.nombre}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.dataset.fallbackApplied !== "1") {
                        img.dataset.fallbackApplied = "1";
                        img.src = FALLBACK;
                      }
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/35 backdrop-blur px-3 py-1 text-sm font-semibold">
                    <CatIcon slug={c.slug} />
                    <span>{c.nombre}</span>
                  </div>
                  {c.descripcion ? (
                    <p className="mt-2 text-xs text-white/85 line-clamp-2">
                      {c.descripcion}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
