import { notFound } from "next/navigation";
import { getCategoriaBySlug, CATEGORIAS } from "@/lib/categorias";
import { productos } from "@/lib/products";
import ProductListClient from "@/components/ProductListClient";

export const revalidate = 3600; // SSG con revalidación
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIAS.map(c => ({ slug: c.slug }));
}

export default function CategoriaSlugPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const lista = productos.filter(p => p.categoria === cat.slug).slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
