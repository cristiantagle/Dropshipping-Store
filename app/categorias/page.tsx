"use client";
import Link from "next/link";
import { getCategorias } from "@/lib/categorias";

export default async function Categorias() {
  const categorias = await getCategorias();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Categorías</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
        {categorias.map((c) => (
          <li key={c.slug}>
            <Link href={`/categorias/${c.slug}`}>
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 rounded-xl flex items-center justify-center">
                <img src={c.icon} alt={c.nombre} className="w-12 h-12 object-contain" />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold line-clamp-1">{c.nombre}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
