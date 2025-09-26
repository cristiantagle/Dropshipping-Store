"use client";

import Image from "next/image";
import { fmtCLP } from "@/src/utils/format";
import { pickImage, Producto } from "@/src/utils/image";

export default function ProductDetail({ p }: { p: Producto }) {
  const img = pickImage(p);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="aspect-square relative bg-gray-100">
        <Image src={img} alt={p.nombre} fill className="object-cover" />
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{p.nombre}</h1>
        <div className="text-gray-700">{fmtCLP(p.precio)}</div>
        {p.descripcion && <p className="text-sm text-gray-600">{p.descripcion}</p>}
        {p.envio && <p className="text-sm text-gray-600">Envío: {p.envio}</p>}
        {p.categoria_slug && <p className="text-sm text-gray-600">Categoría: {p.categoria_slug}</p>}
        <button
          onClick={() => console.log("Agregar al carrito", p.id)}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
