'use client';

import Image from "next/image";

type Item = {
  id?: string | number;
  nombre?: string;
  // aceptar ambos nombres de campo
  imagen?: string;
  image?: string;
  precio?: number | string | null;
  categoria?: string;
};

export default function ProductListClient({ items }: { items: Item[] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No hay productos disponibles.</p>;
  }

  const handleAdd = (it: Item) => {
    // placeholder (no carrito real), evita error en server
    console.log("Agregar:", it?.id ?? it?.nombre);
    alert("Agregado al carrito (demo)");
  };

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((p, i) => {
        const src = p.imagen || p.image || "";
        return (
          <li key={String(p.id ?? i)} className="border rounded-2xl p-3 hover:shadow-sm transition bg-white">
            <div className="aspect-square relative mb-2 rounded-xl overflow-hidden bg-gray-100">
              {src ? (
                <Image
                  src={src}
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
            <button
              type="button"
              onClick={() => handleAdd(p)}
              className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold bg-black text-white hover:bg-gray-800 active:scale-[.99] transition"
            >
              Agregar
            </button>
            {p.categoria && (
              <div className="mt-2 text-[11px] text-gray-500">
                {String(p.categoria)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
