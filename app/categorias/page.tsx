import Link from "next/link";
import { getCategorias } from "@/lib/catalog";

export const dynamic = "force-static";
export const metadata = { title: "Categorías" };

export default async function CategoriasPage() {
  const cats = await getCategorias();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map(c => (
          <li key={c.slug} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <h3 className="font-semibold">{c.nombre}</h3>
            <p className="text-sm text-gray-600">{c.descripcion}</p>
            <Link className="mt-2 inline-block px-3 py-1 rounded bg-black text-white" href={`/categorias/${c.slug}`}>
              Ver {c.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
