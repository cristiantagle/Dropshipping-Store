'use client';
import Image from "next/image";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items?.length) return <p className="text-sm opacity-70">Sin resultados.</p>;
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((p) => (
        <li key={p.id} className="rounded-xl border p-3 hover:shadow transition">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-50">
            {/* Next.js ya optimiza. Con remotePatterns para Unsplash funciona en prod. */}
            <Image src={p.imagen} alt={p.nombre} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
          </div>
          <h3 className="mt-2 font-medium line-clamp-2">{p.nombre}</h3>
          <p className="text-sm text-gray-600">${p.precio.toLocaleString('es-CL')}</p>
        </li>
      ))}
    </ul>
  );
}
