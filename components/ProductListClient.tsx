'use client';

import { useCallback } from "react";

type Producto = {
  id: string | number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria?: string;
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=60&w=800&auto=format&fit=crop";

export default function ProductListClient({ items }: { items: Producto[] }) {
  const onAdd = useCallback((p: Producto) => {
    alert(`Agregado: ${p.nombre}`);
  }, []);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(p => (
        <div key={p.id} className="rounded-xl border p-4 bg-white flex flex-col">
          <div className="aspect-[4/3] overflow-hidden rounded-lg mb-3 bg-gray-50">
            <img
              src={p.imagen}
              alt={p.nombre}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
              }}
            />
          </div>
          <div className="font-medium">{p.nombre}</div>
          {p.categoria ? <div className="text-sm text-gray-500 mt-1">{p.categoria}</div> : null}
          <div className="mt-2 font-semibold">${p.precio.toLocaleString("es-CL")}</div>
          <button
            onClick={() => onAdd(p)}
            className="mt-3 rounded-lg px-3 py-2 border hover:bg-gray-50 transition text-sm font-medium"
          >
            Agregar al carro
          </button>
        </div>
      ))}
    </div>
  );
}
