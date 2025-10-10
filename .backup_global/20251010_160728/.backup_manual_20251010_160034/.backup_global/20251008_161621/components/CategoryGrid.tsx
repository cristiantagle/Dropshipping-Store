'use client';
import Link from "next/link";
import { categorias } from "@/lib/categorias";

export default function CategoryGrid() {
  if (!categorias || categorias.length === 0) {
    return <p className="text-gray-600">No hay categorías disponibles.</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categorias.map((c) => (
        <li
          key={c.slug}
          className="group relative overflow-hidden rounded-2xl border bg-white hover:shadow-md transition"
        >
          <Link href={`/categorias/${c.slug}`} className="block">
            <div className="relative aspect-[4/3] bg-neutral-100">
              <img
                src={c.image_url}
                alt={c.nombre}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="mt-3 text-lg font-semibold">{c.nombre}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
