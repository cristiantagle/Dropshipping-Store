'use client';
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria?: string | null;
  categoria_slug?: string | null;
};

type Props = { items: Producto[] };

const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickUrl(p: Producto): string {
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image];
  const first = cands.find((v) => typeof v === "string" && v.trim().length > 0);
  return (first ?? "").toString().trim();
}
function fmtCLP(v?: number | null) {
  if (v == null) return "$—";
  try {
    return Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `$${v}`;
  }
}

export default function ProductListClient({ items }: Props) {
  const data = Array.isArray(items) ? items : [];
  if (data.length === 0) {
    return (
      <p className="text-gray-600">
        No hay productos disponibles en esta categoría por ahora.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((p) => {
        let src = pickUrl(p);
        if (!src && p.categoria_slug === "bienestar") {
          src = FALLBACK;
        }
        const onErr: React.ReactEventHandler<HTMLImageElement> = (e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.dataset.fallbackApplied !== "1") {
            img.dataset.fallbackApplied = "1";
            img.src = FALLBACK;
          }
        };
        return (
          <li key={p.id} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <div className="aspect-[4/3] w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={src || FALLBACK}
                alt={p.nombre || "Producto"}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={onErr}
              />
            </div>
            <h3 className="font-semibold">{p.nombre}</h3>
            <p className="text-sm text-gray-600">{p.envio || "Envío estándar"}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold">{fmtCLP(p.precio ?? null)}</span>
              <button
                className="px-3 py-1 rounded-xl bg-black text-white text-sm"
                onClick={() => alert(`Agregado: ${p.nombre}`)}
              >
                Agregar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
