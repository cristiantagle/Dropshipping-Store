"use client";
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  categoria?: string | null;
  categoria_slug?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
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
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `$${v ?? 0}`;
  }
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  const data = Array.isArray(items) ? items : [];
  if (data.length === 0) {
    return <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>;
  }

  const agregar = (p: Producto) => {
    try {
      const raw = localStorage.getItem("carro") || "[]";
      const carro = JSON.parse(raw) as Producto[];
      carro.push(p);
      localStorage.setItem("carro", JSON.stringify(carro));
    } catch {}
    alert(`“${p.nombre}” agregado al carro`);
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((p) => {
        let src = pickUrl(p);
        if (!src && p.categoria_slug === "bienestar") src = FALLBACK;

        return (
          <li key={p.id} className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white">
            <div className="relative aspect-[4/3] w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
              {p.destacado ? (
                <span className="absolute z-10 top-2 left-2 inline-flex items-center gap-1 text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow">
                  ⭐ Destacado
                </span>
              ) : null}
              <img
                src={src || FALLBACK}
                alt={p.nombre || "Producto"}
                className="w-full h-full object-cover"
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
            </div>
            <h3 className="font-semibold leading-snug line-clamp-2">{p.nombre}</h3>
            <p className="text-sm text-gray-600">{p.envio || "Envío estándar"}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-emerald-700 font-extrabold text-lg">{fmtCLP(p.precio ?? null)}</span>
              <button
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                onClick={() => agregar(p)}
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
