import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ProductDetail from "@/components/ProductDetail";

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

  return <ProductDetail product={product} relacionados={relacionados || []} />;
}
