import { notFound } from "next/navigation";
import ProductListClient, { type Producto } from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getCategoriaBySlug, normalizaCategoria } from "@/lib/categorias";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return ["hogar","belleza","tecnologia","bienestar","eco","mascotas"].map((slug) => ({ slug }));
}

function perteneceACategoria(p: any, slug: string) {
  // normaliza por campo categoria y además por nombre/descripcion como pista
  const s = normalizaCategoria(slug);
  if (!s) return false;
  const c1 = normalizaCategoria(String(p.categoria || ""));
  const c2 = normalizaCategoria(String(p.nombre || ""));
  const c3 = normalizaCategoria(String(p.descripcion || ""));
  return c1 === s || c2 === s || c3 === s;
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  let lista: Producto[] = productos.filter((p) => perteneceACategoria(p, cat.slug));
  // fallback: si por alguna razón la heurística dio muy pocos, rellena con productos de la misma categoría por igualdad floja de texto
  if (lista.length < 12) {
    const extra = productos.filter((p) =>
      String(p.categoria || "").toLowerCase().includes(cat.slug)
    );
    // mezclar evitando duplicados por id
    const ids = new Set(lista.map(x => x.id));
    for (const e of extra) if (!ids.has(e.id)) lista.push(e);
  }
  lista = lista.slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
