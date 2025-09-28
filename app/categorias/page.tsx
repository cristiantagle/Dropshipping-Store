import Link from "next/link";
import { categorias } from "@/lib/categorias";

export default function CategoriasPage() {
  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categorias.map((cat, idx) => {
          const content = (
            <div className="flex flex-col items-center text-center cursor-pointer hover:opacity-80">
              <img src={cat.icon} alt={cat.nombre} className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">{cat.nombre}</span>
            </div>
          );
          return cat.slug ? (
            <Link href={`/categorias/${cat.slug}`} key={cat.slug}>
              {content}
            </Link>
          ) : (
            <div key={`static-${idx}`} className="opacity-50 cursor-default">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
