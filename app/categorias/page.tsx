import Link from "next/link";
import { categorias } from "../../lib/catalogo";
import ProductList from "../../components/ProductList";

// Marcamos como dinámica por usar searchParams en build/export
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function CategoriasPage({ searchParams }: PageProps) {
  const cParam = (searchParams?.c ?? null);
  const c = Array.isArray(cParam) ? cParam[0] : cParam;
  const actual = categorias.find(x => x.slug === c) || null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/categorias"
          className={`px-3 py-1 rounded-full border ${!actual ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}>
          Todas
        </Link>
        {categorias.map(cat => {
          const active = actual?.slug === cat.slug;
          return (
            <Link
              key={cat.slug}
              href={`/categorias?c=${cat.slug}`}
              className={`px-3 py-1 rounded-full border ${active ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
            >
              {cat.nombre}
            </Link>
          );
        })}
      </div>

      {actual ? (
        <ProductList categoria={actual.slug} titulo={actual.nombre} />
      ) : (
        <ProductList titulo="Todos los productos" />
      )}
    </div>
  );
}
