import Link from "next/link";
import { listCategorias } from "@/lib/categorias";

export const dynamic = "force-static";

export default function CategoriasPage() {
  const cats = listCategorias();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((c) => (
          <li key={c.slug} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <h3 className="font-semibold">{c.nombre}</h3>
            <p className="text-sm text-gray-600">{c.descripcion}</p>
            <div className="mt-2">
              <Link className="underline" href={`/categorias/${c.slug}`}>Ver</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
