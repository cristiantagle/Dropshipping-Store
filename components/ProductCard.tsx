'use client';

import Image from "next/image";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  envio?: string;
};

export default function ProductCard({ p }: { p: Producto }) {
  const handleAdd = () => {
    // Aquí luego conectamos al carro real; por ahora feedback simple:
    alert("Producto agregado al carro");
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full h-48">
        <Image
          src={p.imagen}
          alt={p.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-500 line-clamp-1">{p.envio || "48-72h"}</div>
        <h3 className="font-medium line-clamp-2">{p.nombre}</h3>
        <div className="flex items-center justify-between">
          <span className="font-semibold">${p.precio.toLocaleString("es-CL")}</span>
          <button
            type="button"
            onClick={handleAdd}
            className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
