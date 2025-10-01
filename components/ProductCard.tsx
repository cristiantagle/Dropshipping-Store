'use client';
import { Producto } from "@/lib/products";

export default function ProductCard({ product }: { product: Producto }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden mb-3">
        <img
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
      {product.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      )}
      <p className="mt-2 font-bold text-green-700">
        {Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
          maximumFractionDigits: 0,
        }).format(product.price_cents)}
      </p>
    </div>
  );
}
