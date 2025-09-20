import { notFound } from "next/navigation";
import ProductListClient, { Producto } from "@/components/ProductListClient";
import { getCategoriaBySlug, isCategoria } from "@/lib/categorias";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return ['hogar','belleza','tecnologia','bienestar','eco','mascotas'].map(slug => ({ slug }));
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!isCategoria(slug)) return notFound();
  const cat = getCategoriaBySlug(slug)!;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('products')
    .select('id,name,description,price_cents,image_url,category_slug')
    .eq('category_slug', slug)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error(error);
    return notFound();
  }

  // Normaliza por si viniera null en image_url
  const lista: Producto[] = (data ?? []).map(p => ({
    id: String(p.id),
    name: p.name,
    description: p.description ?? '',
    price_cents: p.price_cents ?? 0,
    image_url: p.image_url ?? '',
    category_slug: p.category_slug
  }));

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
