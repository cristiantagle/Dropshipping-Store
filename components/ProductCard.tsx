"use client";
import { Producto } from "../lib/products";
import { fmtCLP } from "../lib/format";

export default function ProductCard({ product }: { product: Producto }) {
  return (
    <div className="border p-4 rounded shadow-sm hover:shadow-md transition">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover mb-2 rounded"
        />
      )}
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      <p className="text-black font-semibold">{fmtCLP(product.price)}</p>
    </div>
  );
}
