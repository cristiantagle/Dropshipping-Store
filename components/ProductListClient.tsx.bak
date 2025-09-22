"use client";
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  envio?: string | null;
  categoria?: string | null;
  categoria_slug?: string | null;
  destacado?: boolean | null;
  // múltiples llaves posibles para la imagen
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
};

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
    return Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);
  } catch { return `$${v}`; }
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  const data = Array.isArray(items) ? items : [];
  if (data.length === 0) {
    return <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lnr-appear">
      {data.map((p, i) => {
        let src = pickUrl(p);
        if (!src && p.categoria_slug === "bienestar") src = FALLBACK;

        return (
          <li key={p.id}
              className="group rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-lg transition card-3d lnr-appear"
              style={{ animationDelay: `${0.02 * i + 0.04}s` }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-100 lnr-shimmer">
              <img
                src={src || FALLBACK}
                alt={p.nombre || "Producto"}
                className="w-full h-full object-cover img-zoom"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.dataset.fallbackApplied !== "1") {
                    img.dataset.fallbackApplied = "1";
                    img.src = FALLBACK;
                  }
                }}
              />
              {p.destacado ? (
                <div className="absolute top-2 left-2 badge-pill bg-black/80 text-white">Destacado</div>
              ) : null}
              <div className="absolute bottom-2 right-2 badge-pill bg-white/90 text-gray-900 font-bold">
                {fmtCLP(p.precio ?? null)}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold leading-tight line-clamp-2">{p.nombre}</h3>
              <p className="text-sm text-gray-600">{p.envio || "Envío estándar"}</p>
              <button
                onClick={() => alert(`Agregado: ${p.nombre}`)}
                className="btn-brand w-full justify-center"
                aria-label={`Agregar ${p.nombre} al carrito`}
              >
                Agregar al carro
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
