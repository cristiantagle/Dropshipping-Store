import Link from "next/link";
import Image from "next/image";
import { categorias } from "@/lib/catalogo";

export const metadata = {
  title: "Categorías — Lunaria",
  description: "Explora las categorías y descubre nuestros productos."
};

export default function CategoriasIndex() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Categorías</h1>
        <p className="text-sm text-gray-600 mt-1">Elige una categoría para ver sus productos.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categorias/${cat.slug}`}
            className="group rounded-xl border overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <div className="relative h-44 w-full">
              {/* En preview, Next/Image pasará por el loader interno de Vercel (ya permitimos Unsplash en next.config) */}
              <Image
                src={cat.imagen}
                alt={cat.nombre}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={false}
              />
            </div>
            <div className="p-4">
              <h2 className="font-medium">{cat.nombre}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
