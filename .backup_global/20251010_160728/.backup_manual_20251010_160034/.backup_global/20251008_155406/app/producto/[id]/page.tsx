import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  description?: string;
  description_es?: string;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) return notFound();

  const USD_TO_CLP = Number(process.env.NEXT_PUBLIC_USD_TO_CLP) || 950;
  const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;

  const formatPrice = (cents: number) => {
    const clp = (cents / 100) * USD_TO_CLP;
    const finalPrice = clp * MARKUP;
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(finalPrice);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={product.image_url}
        alt={product.name_es || product.name}
        className="w-full h-96 object-contain mb-6"
      />
      <h1 className="text-2xl font-bold mb-2">{product.name_es || product.name}</h1>
      <p className="text-lime-700 font-bold text-xl mb-4">
        {formatPrice(product.price_cents)}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {product.description_es || product.description || "Sin descripción disponible"}
      </p>
    </div>
  );
}
