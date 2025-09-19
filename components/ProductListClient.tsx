// components/ProductListClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen?: string;   // dataset usa "imagen"
  image?: string;    // fallback si quedó alguna como "image"
  categoria: string;
  envio?: string;
  destacado?: boolean;
};

interface Props {
  items: Producto[];
}

export default function ProductListClient({ items }: Props) {
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-center text-gray-600 bg-yellow-50">
        No hay productos disponibles en esta categoría por ahora.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((p) => {
        const src = p.imagen || p.image || "";
        const hasImg = !!src;

        return (
          <li key={p.id} className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
            <Link href={`/producto/${p.id}`} className="block">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {hasImg ? (
                  <Image
                    src={src}
                    alt={p.nombre}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    sin imagen
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-2">{p.nombre}</h3>
              <p className="text-sm text-gray-500">{p.envio || "Envío estándar"}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold">
                  {Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(
                    p.precio ?? 0
                  )}
                </span>
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Agregar
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
