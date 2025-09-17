"use client";
import { Producto } from "@/lib/products";
import Image from "next/image";
export default function ProductCard({ p, onAdd }: { p: Producto; onAdd: (id: string) => void }) {
  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden">
      <div className="relative h-52 w-full">
        <Image src={p.imagen} alt={p.nombre} fill className="object-cover" />
      </div>
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-500">{p.categoria} · {p.envio}</div>
        <h3 className="font-semibold">{p.nombre}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${p.precio.toLocaleString("es-CL")}</span>
          <button onClick={() => onAdd(p.id)} className="px-3 py-1.5 rounded-lg bg-black text-white hover:opacity-90">Agregar</button>
        </div>
      </div>
    </div>
  );
}
