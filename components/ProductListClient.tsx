'use client';

import Image from "next/image";

type Item = {
  id?: string | number;
  nombre?: string;
  imagen?: string;
  precio?: number | string | null;
  categoria?: string;
};

export default function ProductListClient({ items }: { items: Item[] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No hay productos disponibles.</p>;
  }
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((p, i) => (
        <li key={String(p.id ?? i)} className="border rounded-2xl p-3 hover:shadow-sm transition bg-white">
          <div className="aspect-square relative mb-2 rounded-xl overflow-hidden bg-gray-100">
            {p.imagen ? (
              <Image
                src={p.imagen}
                alt={p.nombre ?? "Producto"}
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
          <h3 className="font-semibold line-clamp-2 min-h-[2.5rem]">{p.nombre ?? "—"}</h3>
          {p.precio !== undefined && p.precio !== null && (
            <div className="mt-1 font-bold">
              {typeof p.precio === 'number' ? `$${p.precio.toLocaleString()}` : String(p.precio)}
            </div>
          )}
          {p.categoria && <div className="mt-2 text-xs text-gray-600">{String(p.categoria)}</div>}
        </li>
      ))}
    </ul>
  );
}
