"use client";

import Link from "next/link";

export default function ProductCard({
  id,
  name,
  image_url,
  price_cents,
}: {
  id: string;
  name: string;
  image_url: string;
  price_cents: number;
}) {
  const fmtCLP = (cents: number) =>
    Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(cents);

  return (
    <Link
      href={`/producto/${id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="aspect-[4/3] bg-gray-50 rounded-t-xl overflow-hidden">
        <img
          src={image_url || "/lunaria-icon.png"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-lime-600 transition-colors line-clamp-2">
          {name}
        </h3>
        <p className="mt-2 text-lg font-bold text-lime-700">
          {fmtCLP(price_cents)}
        </p>
      </div>
    </Link>
  );
}
