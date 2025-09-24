"use client";
import Image from "next/image";
import { fmtCLP } from "../lib/format";
import { useCart } from "./useCart";
import { Product } from "../lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="border rounded p-4 flex flex-col items-center">
      <Image src={product.image} alt={product.name} width={200} height={200} />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-gray-600">{fmtCLP(product.price)}</p>
      <button
        onClick={() => addItem(product)}
        className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Agregar al carrito
      </button>
    </div>
  );
}
