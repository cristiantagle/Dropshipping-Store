import "server-only";
import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos } from "@/lib/products";
import { getCategoriaBySlug } from "@/lib/categorias";

// Lee slugs de categorías de forma segura desde lib/categorias
function readAllSlugs(): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@/lib/categorias");
    if (Array.isArray(mod?.CATEGORIAS)) {
      return (mod.CATEGORIAS as any[]).map((c:any) => c?.slug).filter(Boolean);
    }
    if (typeof mod?.getAllCategorias === "function") {
      const arr = mod.getAllCategorias() as any[];
      return (arr ?? []).map((c:any) => c?.slug).filter(Boolean);
    }
  } catch {}
  // fallback conocido del proyecto
  return ["hogar","belleza","tecnologia","bienestar","eco","mascotas"];
}

// Normaliza strings (mantener comportamiento original)
function normalizeCat(s: string) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu,"")
    .replace(/\s+/g," ").trim();
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  return readAllSlugs().map(slug => ({ slug }));
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
      <nav className="text-sm text-neutral-500">
        <a href="/" className="hover:underline">Inicio</a>
        <span className="mx-2">›</span>
        <a href="/categorias" className="hover:underline">Categorías</a>
        <span className="mx-2">›</span>
        <span className="text-neutral-800 dark:text-neutral-200">{cat.nombre}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold">{cat.nombre}</h1>
        <p className="text-gray-600">{cat.descripcion}</p>
      </div>

      <ProductListClient items={lista} />
    </section>
  );
}
