"use client";
import Image from "next/image";

export type Producto = {
  id: string;
  name: string;
  description?: string;
  price_cents: number;
  image_url?: string;
  category_slug: string;
};

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items?.length) return <p>Sin productos.</p>;
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(p => (
        <li key={p.id} className="border rounded-2xl p-4 space-y-3">
          <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-xl">
            {p.image_url ? (
              <Image
                src={p.image_url}
                alt={p.name}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold">${(p.price_cents/100).toLocaleString()}</span>
            <button className="px-3 py-1 rounded-lg bg-black text-white hover:opacity-90">
              Agregar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
