import { notFound } from "next/navigation";
import ProductListClient, { type Producto } from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getCategoriaBySlug, normalizaCategoria } from "@/lib/categorias";

export const dynamic = "force-static";

export async function generateStaticParams() {
  // Genera rutas estáticas para todos los slugs conocidos
  return ["hogar","belleza","tecnologia","bienestar","eco","mascotas"].map((slug) => ({ slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const lista: Producto[] = productos
    .filter((p) => normalizaCategoria(p.categoria) === cat.slug)
    .slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
