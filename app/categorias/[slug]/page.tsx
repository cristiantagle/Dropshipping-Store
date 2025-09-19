import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getAllCategorySlugs, getCategoriaBySlug, normalizaCategoria } from "@/lib/categorias";

export const dynamic = "force-static"; // SSG con params

export async function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({ slug }));
}

export const metadata = {
  title: "Categoría",
};

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  // Filtra por slug canónico; si en products hay nombres, normaliza primero.
  const lista = productos
    .filter(p => {
      const pc = normalizaCategoria(p.categoria ?? "");
      return pc === cat.slug;
    })
    .slice(0, 12);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{cat.nombre}</h1>
        <p className="text-gray-600">{cat.descripcion}</p>
      </div>
      <ProductListClient items={lista} />
    </section>
  );
}
