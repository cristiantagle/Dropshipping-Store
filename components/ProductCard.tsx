"use client";
import { Producto } from "@/lib/products";
import { addToCart } from "@/components/useCart";

export function ProductCard({ producto }: { producto: Producto }) {
  return (
    <div className="border p-4 rounded shadow">
      <img src={producto.imagen || ""} alt={producto.nombre} className="w-full h-40 object-cover mb-2" />
      <h2 className="text-lg font-semibold">{producto.nombre}</h2>
      <p className="text-md font-bold mt-2">${producto.precio}</p>
      <p className="text-xs text-gray-500">{producto.envio}</p>
      <button
        onClick={() => addToCart(producto)}
        className="mt-2 bg-black text-white px-3 py-1 rounded text-sm"
      >
        Agregar al carrito
      </button>
    </div>
  );
}
