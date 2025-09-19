import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";

export const metadata = {
  title: "Categorías",
};

export default async function CategoriasPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIAS.map(c => (
          <li key={c.slug} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <h3 className="font-semibold">{c.nombre}</h3>
            <p className="text-sm text-gray-600">{c.descripcion}</p>
            <Link
              prefetch
              href={`/categorias/${c.slug}`}
              className="inline-block mt-3 text-lime-700 hover:underline"
            >
              Ver {c.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
