'use client';
import { useSearchParams, useRouter } from "next/navigation";
import { categorias } from "../../lib/catalogo";
import ProductList from "../../components/ProductList";

export default function CategoriasPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const c = sp.get("c"); // slug o null

  const actual = categorias.find(x => x.slug === c) || null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => router.push("/categorias")}
          className={`px-3 py-1 rounded-full border ${!actual ? "bg-black text-white" : "bg-white"}`}
        >
          Todas
        </button>
        {categorias.map(cat => (
          <button
            key={cat.slug}
            onClick={() => router.push(`/categorias?c=${cat.slug}`)}
            className={`px-3 py-1 rounded-full border ${actual?.slug === cat.slug ? "bg-black text-white" : "bg-white"}`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {actual ? (
        <ProductList categoria={actual.slug} titulo={actual.nombre} />
      ) : (
        <ProductList titulo="Todos los productos" />
      )}
    </div>
  );
}
