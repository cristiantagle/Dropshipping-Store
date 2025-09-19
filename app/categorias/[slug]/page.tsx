import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getCategoriaBySlug, getAllCategorySlugs } from "@/lib/categorias";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export default function CategoriaSlugPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const lista = productos.filter((p) => p.categoria === cat.slug).slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient productos={lista} />
    </section>
  );
}
