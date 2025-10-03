import { supabaseServer } from "@/lib/supabase/server";
import ProductDetailClient from "@/components/ProductDetailClient";

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();

  const { data: producto, error } = await supabase
    .from("products")
    .select("id, name, description, image_url, price_cents")
    .eq("id", params.id)
    .single();

  if (error || !producto) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <p className="text-gray-600">Producto no encontrado.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <ProductDetailClient producto={producto} />
    </main>
  );
}
