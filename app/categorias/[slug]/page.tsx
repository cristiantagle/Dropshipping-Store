import { notFound } from "next/navigation";
import ProductListClient, { type Producto } from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getCategoriaBySlug, normalizaCategoria, type CategoriaSlug } from "@/lib/categorias";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs: CategoriaSlug[] = ['hogar','belleza','tecnologia','bienestar','eco','mascotas'];
  return slugs.map((slug) => ({ slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const base = productos.filter(p => normalizaCategoria(String(p.categoria)) === cat.slug);

  // Fallback: si hay pocos productos en la data, duplicamos hasta 12 para no dejar la página vacía
  const lista: Producto[] = (() => {
    if (base.length >= 12) return base.slice(0,12);
    if (base.length === 0) return [];
    const out: Producto[] = [];
    while (out.length < 12) {
      for (const item of base) {
        if (out.length >= 12) break;
        // Clon “virtual” con id distinto para la key del listado
        out.push({ ...item, id: `${item.id}-x${Math.ceil((out.length+1)/base.length)}` });
      }
    }
    return out;
  })();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
