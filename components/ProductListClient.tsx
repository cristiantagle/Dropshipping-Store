"use client";
import Image from "next/image";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen_url?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria_slug: string;
};

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items || items.length === 0) {
    return <p>No hay productos disponibles en esta categoría por ahora.</p>;
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(p => (
        <li key={p.id} className="border rounded-2xl p-4 flex flex-col gap-3">
          <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden rounded-xl">
            {p.imagen_url ? (
              <Image
                src={p.imagen_url}
                alt={p.nombre}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full grid place-content-center text-gray-500 text-sm">
                Sin imagen
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{p.nombre}</h3>
            <p className="text-sm text-gray-600">{p.envio || "—"}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold">${(p.precio/100).toFixed(0)}90</span>
            <button className="px-3 py-1 rounded bg-black text-white">Agregar</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
