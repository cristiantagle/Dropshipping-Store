"use client";
import React from "react";
import Image from "next/image";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  categoria_slug?: string | null;
  envio?: string | null;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=800&auto=format&fit=crop";

function pickUrl(p: Producto): string {
  const cands = [p.imagen, p.imagen_url];
  const first = cands.find((v) => v && v.trim().length > 0);
  return (first ?? "").toString().trim();
}

function fmtCLP(v?: number | null) {
  if (v == null) return "$—";
  try {
    return Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `$${v}`;
  }
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items?.length) {
    return <p className="text-gray-600">No hay productos disponibles.</p>;
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => {
        const src = pickUrl(p) || FALLBACK;
        return (
          <li
            key={p.id}
            className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition flex flex-col"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={src}
                alt={p.nombre || "Producto"}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <h3 className="mt-3 font-semibold">{p.nombre}</h3>
            <p className="text-lime-700 font-bold">{fmtCLP(p.precio)}</p>
            <button
              onClick={() => alert(`“${p.nombre}” agregado al carro`)}
              className="mt-3 rounded-xl px-4 py-2 bg-lime-600 text-white hover:bg-lime-700 transition"
            >
              Agregar al carro
            </button>
          </li>
        );
      })}
    </ul>
  );
}
