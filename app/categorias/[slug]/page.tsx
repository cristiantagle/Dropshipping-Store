import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos, Producto } from "@/lib/products";
import { getAllCategorySlugs, getCategoriaBySlug } from "@/lib/categorias";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function CategoriaDetallePage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const lista: Producto[] = productos.filter((p) => p.categoria === cat.slug).slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
