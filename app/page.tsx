"use client";
import Link from "next/link";
import { Producto } from "../lib/products";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  // Aquí deberías traer tus productos desde Supabase o props
  const mockData: any[] = []; // reemplazar con fetch real

  const productos: Producto[] = mockData.map((m) => ({
    id: m.id,
    name: m.nombre ?? m.name ?? "",
    description: m.descripcion ?? m.description ?? "",
    price: m.precio ?? m.price ?? 0,
    image: m.imagen || m.imagen_url || m.image_url || m.image || "",
    category_slug: m.category_slug ?? "",
  }));

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos destacados</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <Link href="/categorias" className="mt-6 inline-block bg-black text-white px-4 py-2 rounded">
        Ver todas las categorías
      </Link>
    </main>
  );
}
