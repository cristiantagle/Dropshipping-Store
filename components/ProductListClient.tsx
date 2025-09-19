"use client";
import Image from "next/image";

export type Producto = {
  id?: string | number;
  nombre?: string;   // es
  name?: string;     // en
  precio?: number;   // es
  price?: number;    // en
  imagen?: string;   // es
  image?: string;    // en
  categoria?: string;
  category?: string;
};

function pick<T>(...vals: (T | undefined)[]): T | undefined {
  return vals.find(v => v !== undefined);
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-600">No hay productos para esta categoría.</p>;
  }

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.slice(0, 12).map((p, i) => {
        const id = (p.id ?? `${pick(p.nombre, p.name) ?? "item"}-${i}`) as React.Key;
        const title = pick(p.nombre, p.name) ?? "Producto";
        const img = pick(p.imagen, p.image);
        const price = pick<number>(p.precio, p.price);

        return (
          <li key={id} className="border rounded-xl p-3 bg-white">
            <div className="aspect-square relative mb-2 bg-gray-50 overflow-hidden rounded-lg">
              {img ? (
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 20vw"
                  style={{ objectFit: "cover" }}
                  priority={i < 4}
                  unoptimized={false}
                />
              ) : (
                <div className="w-full h-full grid place-content-center text-xs text-gray-500">Sin imagen</div>
              )}
            </div>
            <h3 className="font-medium">{title}</h3>
            {typeof price === "number" && (
              <p className="text-sm text-gray-700">
                ${price.toLocaleString("es-CL")}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
