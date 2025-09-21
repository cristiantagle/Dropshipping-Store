// components/CategoryGrid.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

type Cat = {
  slug: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string | null;
};

// Imágenes representativas por categoría (solo fallback si no hay imagen_url)
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

// Fallback visual si algo extremo falla
const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

// Leemos las categorías de lib/categorias.ts sin romper si cambia la export.
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


const CAT_IMAGES: Record<string, string> = {
  hogar: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  belleza: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  tecnologia: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  eco: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
  mascotas: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  bienestar: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop"
};

export default function CategoryGrid() {
  const categorias = readCategoriasSafely();
  if (!categorias.length) return null;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categorias.map((cat: Cat) => {
        const img = (cat.imagen_url && String(cat.imagen_url).trim()) || CAT_IMAGES[cat.slug] || FALLBACK;
        return (
          <li key={cat.slug}>
            <Link
              href={`/categorias/${cat.slug}`}
              className="group block border rounded-2xl overflow-hidden hover:shadow-md transition"
              prefetch
            >
              <div className="aspect-[4/3] bg-gray-100 relative">
                <Image
                  src={img}
                  alt={cat.nombre}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:underline">{cat.nombre}</h3>
                {cat.descripcion ? (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {cat.descripcion}
                  </p>
                ) : null}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
