import { notFound } from "next/navigation";
import { getCategoriaBySlug, type CategoriaSlug } from "@/lib/categorias";
import { getProductosByCategoria } from "@/lib/products.helpers";
import ProductListClient from "@/components/ProductListClient";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  return [
    { slug: "hogar" },
    { slug: "belleza" },
    { slug: "tecnologia" },
    { slug: "bienestar" },
    { slug: "eco" },
    { slug: "mascotas" },
  ];
}

export default function CategoriaPage({ params }: { params: { slug: CategoriaSlug } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const lista = getProductosByCategoria(cat.slug, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
