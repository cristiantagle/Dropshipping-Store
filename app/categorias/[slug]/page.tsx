import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { getCategoria, getProductosByCategoria } from "@/lib/catalog";

export const dynamic = "force-static";
export const metadata = { title: "Categoría" };

export async function generateStaticParams() {
  // Render estático sincrónico: build-time fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/categorias?select=slug`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" }
  });
  const data = await res.json();
  return (data || []).map((x:any)=>({ slug: x.slug }));
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = await getCategoria(params.slug);
  if (!cat) return notFound();

  const lista = await getProductosByCategoria(params.slug, 12);

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
