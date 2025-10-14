"use client";

import { useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import { useProductText } from "@/lib/useProductText";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductDetail({ product, relacionados }: any) {
  const { name, shortDesc, longDesc } = useProductText(product);
  const [activeTab, setActiveTab] = useState<"descripcion" | "envio" | "opiniones">("descripcion");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galería */}
        <div>
          <Image
            src={product.image_url}
            alt={name ?? product?.name ?? 'Producto'}
            width={800}
            height={384}
            unoptimized
            className="w-full h-96 object-contain rounded-lg shadow-md transform transition duration-300 ease-out hover:scale-105 hover:shadow-xl"
          />
          {product.images?.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((img: string, i: number) => (
                <Image
                  key={i}
                  src={img}
                  alt={`${name ?? product?.name ?? 'Producto'} ${i}`}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 object-contain border rounded-md transition-transform duration-200 hover:scale-110 hover:border-lime-600"
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-lime-700 font-bold text-2xl mb-4">{formatPrice(product.price_cents)}</p>
          {shortDesc && <p className="text-gray-600 mb-4">{shortDesc}</p>}
          <div className="w-full md:w-auto">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                name_es: product.name_es,
                image_url: product.image_url,
                price_cents: product.price_cents,
                category_slug: product.category_slug,
              }}
              className="w-full"
            />
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex border-b">
              {["descripcion", "envio", "opiniones"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === tab ? "border-b-2 border-lime-600 text-lime-600" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab === "descripcion" ? "Descripción" : tab === "envio" ? "Envío" : "Opiniones"}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeTab === "descripcion" && (
                <p className="text-gray-700 whitespace-pre-line">{longDesc || "Sin descripción disponible."}</p>
              )}
              {activeTab === "envio" && (
                <div>
                  <p className="text-gray-700">
                    {product.envio || "Envío estándar"}{" "}
                    {product.envio_gratis && <span className="text-lime-600 font-bold">(Gratis)</span>}
                  </p>
                  {product.shipping_days_min && (
                    <p className="text-gray-500 text-sm">
                      Tiempo estimado: {product.shipping_days_min} - {product.shipping_days_max} días
                    </p>
                  )}
                </div>
              )}
              {activeTab === "opiniones" && (
                <p className="text-gray-500 italic">Aún no hay reseñas para este producto.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {relacionados?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relacionados.map((p: any) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
