// components/CategoryGrid.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

/**
 * Tomamos las categorías **canónicas** desde lib/categorias.ts para que la Home
 * refleje exactamente lo que existe en /categorias/[slug].
 *
 * Soporta ambas firmas:
 *  - export function getAllCategorias(): { slug, nombre, descripcion?, imagen_url? }[]
 *  - export const CATEGORIAS = [...]
 */
type Cat = {
  slug: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string | null;
};

// Intento robusto de leer categorías sin romper si cambia la export.
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
  const categorias = readCategoriasSafely();
  if (!categorias.length) return null;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categorias.map((cat: Cat) => (
        <li key={cat.slug}>
          <Link
            href={`/categorias/${cat.slug}`}
            className="group block border rounded-2xl overflow-hidden hover:shadow-md transition"
            prefetch
          >
            <div className="aspect-[4/3] bg-gray-100 relative">
              {cat.imagen_url ? (
                <Image
                  src={cat.imagen_url}
                  alt={cat.nombre}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold group-hover:underline">{cat.nombre}</h3>
              {cat.descripcion ? (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cat.descripcion}</p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
