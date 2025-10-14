import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ProductDetail from "@/components/ProductDetail";
import Breadcrumb from "@/components/Breadcrumb";
import { getCategory } from "@/lib/categorias";

// ✅ Deshabilitar cache en desarrollo para datos siempre frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) return notFound();

  const { data: relacionados } = await supabase
    .from("products")
    .select("*")
    .limit(4);

  const cat = product?.category_slug ? getCategory(product.category_slug) : undefined;
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Categorías", href: "/categorias" },
    ...(cat && product?.category_slug
      ? [{ label: cat.nombre, href: `/categorias/${product.category_slug}` }]
      : []),
    { label: product.name_es || product.name },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-6">
      <Breadcrumb items={crumbs} />
      <ProductDetail product={product} relacionados={relacionados || []} />
    </main>
  );
}
