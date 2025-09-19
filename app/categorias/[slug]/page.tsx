import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { getCategoriaBySlug, ALL_SLUGS } from "@/lib/categorias";
import { getProductosByCategoria } from "@/lib/products.helpers";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const items = getProductosByCategoria(cat.slug, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={items} />
    </section>
  );
}
