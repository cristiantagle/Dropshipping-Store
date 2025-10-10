"use client";

import { useCart } from "@/components/useCart";

export default function ProductDetailClient({ producto }: { producto: any }) {
  const { add: agregarAlCarro } = useCart();

  const fmtCLP = (cents: number) =>
    Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(cents);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-[4/3] w-full bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={producto.image_url || "/lunaria-icon.png"}
          alt={producto.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">{producto.name}</h1>
        <p className="text-gray-600 mb-6">{producto.description || "Sin descripción"}</p>
        <p className="text-lg font-semibold mb-6">{fmtCLP(producto.price_cents)}</p>
        <button
          onClick={() => agregarAlCarro(producto)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Agregar al carro
        </button>
      </div>
    </div>
  );
}
