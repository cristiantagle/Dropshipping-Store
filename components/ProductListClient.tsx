"use client";
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen_url?: string | null;
  imagen?: string | null;
  image?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria_slug?: string | null;
};

type Props = { items: Producto[] };

const SAFE_FALLBACK =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac8d58?q=80&w=1200&auto=format&fit=crop";

function pickImage(p: Producto): string {
  const raw = (p.imagen_url ?? p.imagen ?? (p as any).image ?? "").toString().trim();
  return raw || SAFE_FALLBACK;
}

function formatPrice(v?: number | null): string {
  if (v == null) return "$—";
  try {
    return v.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  } catch { return `$${v}`; }
}

export default function ProductListClient({ items }: Props) {
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800">
        No hay productos disponibles en esta categoría por ahora.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((p) => {
        const src = pickImage(p);
        const alt = (p?.nombre?.toString().trim() || "Producto") + " - imagen";
        const precio = formatPrice(p?.precio ?? null);
        return (
          <li key={p.id} className="border rounded-2xl overflow-hidden bg-white hover:shadow transition">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  if (el.src !== SAFE_FALLBACK) el.src = SAFE_FALLBACK;
                }}
              />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold line-clamp-2">{p.nombre}</h3>
              <div className="text-sm text-gray-600">{precio}</div>
              {p.envio && <div className="text-xs text-gray-500">{p.envio}</div>}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full rounded-xl bg-black text-white py-2 text-sm hover:opacity-90"
                  onClick={() => console.log("Agregar", p.id)}
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
