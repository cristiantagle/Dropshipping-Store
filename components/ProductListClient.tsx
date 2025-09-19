"use client";
import Image from "next/image";

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria: string;
  imagen: string;
  url?: string;
}

function formatPrice(v?: number) {
  if (v == null) return null;
  try { return v.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }); }
  catch { return `$${v}`; }
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  const onError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const el = e.currentTarget as HTMLImageElement & { _fallback?: boolean };
    if (!el._fallback) { el._fallback = true; el.src = "/placeholder.png"; }
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => {
        const precio = formatPrice(p.precio);
        return (
          <li key={p.id} className="border rounded-2xl p-4 hover:shadow-sm transition bg-white">
            <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl bg-gray-200">
              <img
                src={p.imagen}
                alt={p.nombre}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={onError}
              />
            </div>
            <h3 className="font-semibold leading-snug">{p.nombre}</h3>
            {p.descripcion ? (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.descripcion}</p>
            ) : null}
            <div className="mt-3 flex items-center justify-between">
              {precio ? <span className="font-semibold">{precio}</span> : <span />}
              {p.url ? (
                <a className="text-sm font-medium underline" href={p.url} target="_blank" rel="noopener noreferrer">
                  Ver producto
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
