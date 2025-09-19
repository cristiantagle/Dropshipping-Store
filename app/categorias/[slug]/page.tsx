import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getAllCategorySlugs, getCategoriaBySlug, normalizaCategoria } from "@/lib/categorias";


// Normaliza strings: quita acentos y baja a minúsculas
function normalizeCat(s: string) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/p{Diacritic}/gu,"")
    .replace(/s+/g," ").trim();
}

export const dynamic = "force-static";

export 
// Normaliza strings: quita acentos y baja a minúsculas
function normalizeCat(s: string) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/p{Diacritic}/gu,"")
    .replace(/s+/g," ").trim();
}

async function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({ slug }));
}

export const metadata = { title: "Categoría" };

export default 
// Normaliza strings: quita acentos y baja a minúsculas
function normalizeCat(s: string) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/p{Diacritic}/gu,"")
    .replace(/s+/g," ").trim();
}

async function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const lista = productos
    .filter(p => normalizaCategoria(p.categoria ?? "") === cat.slug)
    .slice(0,12);

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
