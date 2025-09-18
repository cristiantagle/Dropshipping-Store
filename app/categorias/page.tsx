import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";

export const metadata = {
  title: "Categorías | Lunaria",
  description: "Explora productos por categoría",
};

export default function CategoriasPage() {
  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Categorías</h1>
          <p className="text-gray-600">Explora por interés</p>
        </div>
        <Link href="/" className="text-sm underline">Volver al inicio</Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIAS.map((c) => (
          <Link
            key={c.slug}
            href={`/categorias/${c.slug}`}
            className="rounded-xl border p-4 hover:shadow-sm transition bg-white"
          >
            <div className="text-sm text-gray-500">Categoría</div>
            <div className="font-semibold">{c.nombre}</div>
            <div className="mt-2 text-xs text-gray-500">/categorias/{c.slug}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
