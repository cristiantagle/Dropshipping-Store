import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { useProductText } from "@/lib/useProductText";

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  images?: string[];
  price_cents: number;
  description_es?: string;
  short_desc_es?: string;
  long_desc_es?: string;
  envio?: string;
  envio_gratis?: boolean;
  shipping_days_min?: number;
  shipping_days_max?: number;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) return notFound();

  const { name, description, shortDesc, longDesc } = useProductText(product);

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
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Galería de imágenes */}
      <div>
        <img
          src={product.image_url}
          alt={name}
          className="w-full h-96 object-contain rounded-lg shadow-md"
        />
        {product.images && product.images.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {product.images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`${name} ${i}`}
                className="w-20 h-20 object-contain border rounded-md hover:scale-105 transition"
              />
            ))}
          </div>
        )}
      </div>

      {/* Info principal */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-lime-700 font-bold text-2xl mb-4">
          {formatPrice(product.price_cents)}
        </p>
        {shortDesc && (
          <p className="text-gray-600 mb-4">{shortDesc}</p>
        )}
        <button className="bg-lime-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lime-700 transition w-full md:w-auto">
          Agregar al carrito
        </button>

        {/* Secciones */}
        <div className="mt-8 space-y-6">
          {longDesc && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-line">{longDesc}</p>
            </section>
          )}
          <section>
            <h2 className="text-lg font-semibold mb-2">Envío</h2>
            <p className="text-gray-700">
              {product.envio || "Envío estándar"}{" "}
              {product.envio_gratis && <span className="text-lime-600 font-bold">(Gratis)</span>}
            </p>
            {product.shipping_days_min && (
              <p className="text-gray-500 text-sm">
                Tiempo estimado: {product.shipping_days_min} - {product.shipping_days_max} días
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
