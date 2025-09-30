import Link from "next/link";
import { categorias } from "@/lib/categorias";

export default function CategoriasPage() {
  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categorias.map((cat, idx) => {
          const content = (
            <div className="group relative overflow-hidden rounded-2xl border bg-white hover:shadow-md transition">
              <div className="relative aspect-[4/3] bg-neutral-100 flex flex-col items-center justify-center">
                <img
                  src={cat.icon}
                  alt={cat.nombre}
                  className="w-16 h-16 object-contain transition-transform duration-500 group-hover:scale-[1.05]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-lime-600/95 text-white px-3 py-1.5 text-sm font-semibold shadow-sm">
                  {cat.nombre}
                </span>
              </div>
            </div>
          );
          const key = cat.slug ?? `static-${idx}`;
          return (
            <li key={key}>
              {cat.slug ? (
                <Link href={`/categorias/${cat.slug}`}>{content}</Link>
              ) : (
                <div className="opacity-50 cursor-default">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
