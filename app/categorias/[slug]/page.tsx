import Link from "next/link";
import { notFound } from "next/navigation";
import { productos } from "@/lib/products";
import ProductListClient from "@/components/ProductListClient";
import { CATEGORIAS, getCategoriaBySlug, normalizarCategoria } from "@/lib/categorias";

type Params = { slug: string };

export function generateStaticParams() {
  return CATEGORIAS.map(c => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Params }) {
  const cat = getCategoriaBySlug(params.slug);
  return { title: cat ? `${cat!.nombre} | Lunaria` : "Categoría | Lunaria" };
}

export default function CategoriaPage({ params }: { params: Params }) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const lista = productos
    .filter(p => normalizarCategoria((p as any).categoria) === cat.slug)
    .slice(0, 12)
    .map(p => ({
      id: (p as any).id,
      nombre: (p as any).nombre,
      precio: (p as any).precio,
      imagen: (p as any).imagen,
      categoria: (p as any).categoria,
    }));

  return (
    <section className="space-y-8">
      <nav className="text-sm text-gray-600">
        <Link className="underline" href="/">Inicio</Link>
        <span className="mx-2">/</span>
        <Link className="underline" href="/categorias">Categorías</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{cat.nombre}</span>
      </nav>

      <header>
        <h1 className="text-2xl md:text-3xl font-bold">{cat.nombre}</h1>
        <p className="text-gray-600">Mostrando productos de {cat.nombre}</p>
      </header>

      <ProductListClient items={lista} />
    </section>
  );
}
