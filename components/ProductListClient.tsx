"use client";
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  envio?: string;
  destacado?: boolean;
  categoria_slug?: string;
  imagen?: string;
  imagen_url?: string;
  image_url?: string;
  image?: string;
};

export default function ProductListClient({ items }: { items: Producto[] }) {
  const data = Array.isArray(items) ? items : [];
  // Fallback fitness muy estable
  const fallback = "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

  const pickUrl = (p: Producto) => {
    const cands = [p.imagen, p.imagen_url, p.image_url, p.image];
    const first = cands.find((v) => typeof v === "string" && v.trim().length > 0);
    return (first ?? "").toString().trim();
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((p) => {
        let src = pickUrl(p);
        // Enfocado al caso de Bienestar: si viniera raro, aplicamos fallback automático
        if (!src && (p.categoria_slug === "bienestar")) {
          src = fallback;
        }
        const onErr: React.ReactEventHandler<HTMLImageElement> = (e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.dataset.fallbackApplied !== "1") {
            img.dataset.fallbackApplied = "1";
            img.src = fallback;
          }
        };
        return (
          <li key={p.id} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <div className="aspect-[4/3] w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={src || fallback}
                alt={p.nombre}
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
              <span className="font-bold">
                {Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(p.precio ?? 0)}
              </span>
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
