"use client";
import Image from "next/image";

export type Producto = {
  id?: string | number;
  nombre: string;
  precio?: number;
  imagen?: string;
  categoria?: string;
};

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-600">No hay productos para esta categoría.</p>;
  }
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((p, i) => (
        <li key={(p.id ?? `${p.nombre}-${i}`) as React.Key} className="border rounded-xl p-3 bg-white">
          <div className="aspect-square relative mb-2 bg-gray-50 overflow-hidden rounded-lg">
            {p.imagen ? (
              <Image
                src={p.imagen}
                alt={p.nombre}
                fill
                sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 20vw"
                style={{ objectFit: "cover" }}
                priority={i < 4}
              />
            ) : (
              <div className="w-full h-full grid place-content-center text-xs text-gray-500">Sin imagen</div>
            )}
          </div>
          <h3 className="font-medium">{p.nombre}</h3>
          {typeof p.precio === "number" && (
            <p className="text-sm text-gray-700">${p.precio.toLocaleString("es-CL")}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
