import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";

export const metadata = { title: "Categorías | Lunaria" };

export default function CategoriasIndex() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Categorías</h1>
        <p className="text-gray-600">Explora nuestro catálogo por categoría.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIAS.map((c) => (
          <Link
            key={c.slug}
            href={`/categorias/${c.slug}`}
            className="rounded-xl border p-4 bg-white hover:shadow transition block"
          >
            <div className="text-lg font-semibold">{c.nombre}</div>
            {c.descripcion ? <p className="text-sm text-gray-600 mt-1">{c.descripcion}</p> : null}
            <div className="text-sm text-indigo-600 mt-3 underline">Ver</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
