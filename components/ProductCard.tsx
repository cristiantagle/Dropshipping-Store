"use client";
import { Producto } from "@/lib/products";
import Image from "next/image";
import { motion } from "framer-motion";
export default function ProductCard({ p, onAdd }: { p: Producto; onAdd: (id: string) => void }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-2xl border shadow-sm bg-white overflow-hidden">
      <div className="relative h-52 w-full">
        <Image src={p.imagen} alt={p.nombre} fill className="object-cover" />
      </div>
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-500">{p.categoria} · {p.envio}</div>
        <h3 className="font-semibold">{p.nombre}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${p.precio.toLocaleString("es-CL")}</span>
          <button onClick={() => onAdd(p.id)} className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium bg-black text-white hover:opacity-90">Agregar</button>
        </div>
      </div>
    </motion.div>
  );
}
