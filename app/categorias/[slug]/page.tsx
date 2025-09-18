import Link from "next/link";
import { notFound } from "next/navigation";
import { productos } from "@/lib/products";
import { categorias } from "@/lib/catalogo";
import ProductCard from "@/components/ProductCard";

type Props = { params: { slug: "belleza" | "hogar" | "tecnologia" } };

export function generateStaticParams() {
  return categorias.map(c => ({ slug: c.slug }));
}
export const dynamicParams = false;

export const metadata = {
  title: "Categoría — Lunaria",
  description: "Listado por categoría."
};

export default function CategoriaPage({ params }: Props) {
  const cat = categorias.find(c => c.slug === params.slug);
  if (!cat) return notFound();

  const lista = productos.filter(p => p.categoria === cat.slug).slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/categorias" className="text-sm underline">← Todas las categorías</Link>
        <h1 className="text-xl font-semibold">{cat.nombre}</h1>
      </div>

      {lista.length === 0 ? (
        <p className="text-sm text-gray-600">No hay productos para esta categoría.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lista.map(p => (
            <ProductCard key={p.id} p={p} onAdd={() => alert("Producto agregado al carro")} />
          ))}
        </div>
      )}
    </div>
  );
}
