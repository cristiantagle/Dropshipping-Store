"use client";

import Image from "next/image";
import Link from "next/link";

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria: string;   // puede venir libre, lo normalizamos donde se filtra
  imagen: string;
  url?: string;
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  const onError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const el = e.currentTarget as HTMLImageElement & { _fallback?: boolean };
    if (!el._fallback) {
      el._fallback = true;
      el.src = "/placeholder.png";
    }
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => (
        <li key={p.id} className="border rounded-2xl p-4 hover:shadow-sm transition bg-white">
          <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl bg-gray-100">
            {/* Usamos <img> para onError simple; Next/Image onError no cambia src fácilmente sin state */}
            <img
              src={p.imagen}
              alt={p.nombre}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={onError}
            />
          </div>
          <h3 className="font-semibold">{p.nombre}</h3>
          {p.descripcion ? <p className="text-sm text-gray-600 line-clamp-2">{p.descripcion}</p> : null}
          {p.url ? (
            <Link className="inline-block mt-3 text-sm font-medium underline" href={p.url}>Ver producto</Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
