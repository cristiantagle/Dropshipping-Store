import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getAllCategorySlugs, getCategoriaBySlug, normalizaCategoria } from "@/lib/categorias";



// Normaliza strings: quita acentos y baja a minúsculas
function normalizeCat(s: string) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu,"")
    .replace(/\s+/g," ").trim();
}
export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({ slug }));
}

export const metadata = { title: "Categoría" };

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const nNombre = normalizeCat(cat.nombre);
  const nSlug = normalizeCat((cat as any).slug ?? "");
  let lista = productos.filter((p:any) => {
    const nCat = normalizeCat(p.categoria);
    return nCat === nNombre || nCat === nSlug;
  }).slice(0,12);

  if (lista.length === 0) {
    lista = productos.filter((p:any) => {
      const h = `${p.categoria||""} ${p.nombre||""}`.toLowerCase();
      return h.includes(nNombre) || (nSlug && h.includes(nSlug));
    }).slice(0,12);
  }

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
