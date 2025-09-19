'use client';

import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/lib/products"; // <- tipo compartido

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No hay productos disponibles.</p>;
  }
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((p) => (
        <li key={String(p.id)} className="border rounded-2xl p-3 hover:shadow-sm transition bg-white">
          <div className="aspect-square relative mb-2 rounded-xl overflow-hidden bg-gray-100">
            {p.imagen ? (
              <Image
                src={p.imagen}
                alt={p.nombre}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
                priority={false}
              />
            ) : (
              <div className="w-full h-full grid place-content-center text-xs text-gray-500">
                Sin imagen
              </div>
            )}
          </div>
          <h3 className="font-semibold line-clamp-2 min-h-[2.5rem]">{p.nombre}</h3>
          {p.precio !== undefined && p.precio !== null && (
            <div className="mt-1 font-bold">
              {typeof p.precio === 'number' ? `$${p.precio.toLocaleString()}` : p.precio}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-600">{String(p.categoria)}</div>
          <div className="mt-2">
            <Link href="#" className="text-primary hover:underline text-sm">Ver detalle</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
