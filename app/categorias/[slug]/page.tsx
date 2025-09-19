import { notFound } from "next/navigation";
import ProductListClient, { Producto } from "@/components/ProductListClient";
import { productos as base } from "@/lib/products";

type PageProps = { params: { slug: string } };

// normaliza slug para cotejar con categoria|category
function norm(x?: string) {
  return (x ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function CategoriaPage({ params }: PageProps) {
  const slug = norm(params.slug);

  // filtra aceptando `categoria` o `category`
  const lista: Producto[] = (base as any[])
    .filter((p) => {
      const c = norm(p.categoria ?? p.category);
      return c === slug;
    })
    .slice(0, 12);

  if (lista.length === 0) return notFound();

  // título: toma el nombre humano de la primera coincidencia
  const titulo = (lista[0]?.categoria ?? lista[0]?.category ?? slug).toString();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {titulo}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
