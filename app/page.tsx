"use client";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const productos = await getProducts();

  return (
    <main className="space-y-12">
      {/* Hero visual original */}
      <section className="relative bg-gray-100">
        <div className="absolute inset-0">
          <img
            src="https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/hero/hero.png"
            alt="Hero Lunaria"
            className="w-full h-full object-cover opacity-40"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center text-gray-900">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Bienvenido a Lunaria</h1>
          <p className="text-lg sm:text-xl mb-6">
            Productos útiles y bonitos con envío simple. Todo sustentable, todo fácil.
          </p>
          <Link
            href="/categorias"
            className="inline-block px-6 py-3 bg-lime-600 text-white rounded-full font-semibold hover:bg-lime-700 transition"
          >
            Explorar categorías
          </Link>
        </div>
      </section>

      {/* Grilla de productos funcional actual */}
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
