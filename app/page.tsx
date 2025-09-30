"use client";
import Link from "next/link";
import { getProductos } from "@/lib/products";

export default async function Home() {
  const productos = await getProductos();

  return (
    <main className="space-y-12">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
          {productos.map((m) => (
            <li key={m.id}>
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
