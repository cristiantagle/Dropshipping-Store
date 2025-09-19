// app/categorias/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getCategoriaBySlug, toSlug } from "@/lib/categorias";
import { productos } from "@/lib/products";
import ProductListClient from "@/components/ProductListClient";

type Params = { slug: string };

export default async function CategoriaPage({ params }: { params: Params }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  // p.categoria puede venir como "Hogar"/"Belleza" o ya como slug.
  const lista = productos
    .filter((p: any) => toSlug(p.categoria) === cat.slug)
    .slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
