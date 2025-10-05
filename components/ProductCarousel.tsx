"use client";

import Link from "next/link";

interface Props {
  products: {
    id: string;
    name: string;
    image_url: string;
    price_cents: number;
  }[];
}

export default function ProductCarousel({ products }: Props) {
  const fmtCLP = (cents: number) =>
    Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(cents);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 snap-x snap-mandatory pb-4 items-stretch">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/producto/${product.id}`}
            className="group flex-shrink-0 w-52 flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Imagen fija */}
            <div className="h-[140px] bg-gray-50 rounded-t-xl overflow-hidden">
              <img
                src={product.image_url || "/lunaria-icon.png"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Caja inferior compacta */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-lime-600 transition-colors leading-snug line-clamp-4">
                {product.name}
              </h3>
              <p className="mt-2 text-base font-bold text-lime-700">
                {fmtCLP(product.price_cents)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
