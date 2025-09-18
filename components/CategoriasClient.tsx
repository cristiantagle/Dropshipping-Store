'use client';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList";
import { categorias } from "@/lib/catalogo";

export default function CategoriasClient() {
  const sp = useSearchParams();
  const c = sp.get("c");
  const actual = categorias.find(x => x.slug === c) || null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/categorias" scroll={false}
          className={`px-3 py-1 rounded-full border ${!actual ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}>Todas</Link>
        {categorias.map(cat => {
          const active = actual?.slug === cat.slug;
          return (
            <Link key={cat.slug} href={`/categorias?c=${cat.slug}`} scroll={false}
              className={`px-3 py-1 rounded-full border ${active ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}>
              {cat.nombre}
            </Link>
          );
        })}
      </div>

      {actual ? (
        <ProductList categoria={actual.slug as any} titulo={actual.nombre} limit={10} />
      ) : (
        <ProductList titulo="Todos los productos" />
      )}
    </div>
  );
}
