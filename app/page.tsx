"use client";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const productos = await getProducts();

  return (
    <main className="space-y-12">
      <section className="bg-lime-50 border-b py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-lime-700">Bienvenido a Lunaria</h1>
          <p className="text-gray-700 text-lg">
            Productos útiles y bonitos con envío simple. Todo sustentable, todo fácil.
          </p>
          <Link
            href="/categorias"
            className="inline-block mt-4 px-6 py-3 bg-lime-600 text-white rounded-full font-semibold hover:bg-lime-700 transition"
          >
            Explorar categorías
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
          {productos.map((m) => (
            <li key={m.id}>
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 rounded-xl">
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
