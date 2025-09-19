'use client';

import Image from "next/image";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria?: string;
  destacado?: boolean;
};

export default function ProductListClient({ items }: { items: Producto[] }) {
  const agregar = (p: Producto) => {
    try {
      const raw = localStorage.getItem("carro") || "[]";
      const carro = JSON.parse(raw) as Producto[];
      carro.push(p);
      localStorage.setItem("carro", JSON.stringify(carro));
    } catch {}
    alert(`“${p.nombre}” agregado al carro`);
  };

  if (!items?.length) {
    return <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => (
        <div key={p.id} className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={p.imagen}
              alt={p.nombre}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="mt-3 space-y-1">
            <h3 className="font-semibold leading-tight">{p.nombre}</h3>
            <p className="text-lime-700 font-bold">${p.precio.toLocaleString("es-CL")}</p>
          </div>
          <button
            onClick={() => agregar(p)}
            className="mt-3 w-full rounded-xl px-4 py-2 bg-lime-600 text-white hover:bg-lime-700 transition"
          >
            Agregar al carro
          </button>
        </div>
      ))}
    </div>
  );
}
