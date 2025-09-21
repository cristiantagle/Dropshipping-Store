"use client";
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  // nombres posibles de imagen que hemos visto
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria?: string | null;
  categoria_slug?: string | null;
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
    return Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `$${v}`;
  }
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  const data = Array.isArray(items) ? items : [];

  if (data.length === 0) {
    return (
      <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>
    );
  }

  const onErr: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget as HTMLImageElement;
    if (img.dataset.fallbackApplied !== "1") {
      img.dataset.fallbackApplied = "1";
      img.src = FALLBACK;
    }
  };

  const agregar = (p: Producto) => {
    try {
      const raw = localStorage.getItem("carro") || "[]";
      const carro = JSON.parse(raw) as Producto[];
      carro.push(p);
      localStorage.setItem("carro", JSON.stringify(carro));
    } catch {}
    // micro feedback
    const btn = document.querySelector<HTMLButtonElement>(`button[data-id="${p.id}"]`);
    if (btn) {
      btn.classList.remove("btn-pulse");
      // force reflow
      void btn.offsetWidth;
      btn.classList.add("btn-pulse");
      setTimeout(() => btn.classList.remove("btn-pulse"), 700);
    }
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((p) => {
        let src = pickUrl(p);
        // Caso Bienestar terco → aplica fallback si viene vacío
        if (!src && p.categoria_slug === "bienestar") {
          src = FALLBACK;
        }
        return (
          <li
            key={p.id}
            className="group relative rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all overflow-hidden card-lift"
          >
            {/* Badge destacado */}
            {p.destacado ? (
              <div className="absolute left-3 top-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-lime-600 text-white text-xs font-semibold px-2.5 py-1 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.31L12 14.77l-4.78 2.5.91-5.31L4.27 7.62l5.34-.78L12 2z"/></svg>
                  Destacado
                </span>
              </div>
            ) : null}

            {/* Imagen */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <img
                src={src || FALLBACK}
                alt={p.nombre || "Producto"}
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={onErr}
              />
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-gray-900">
                {p.nombre}
              </h3>
              <p className="text-sm text-gray-500">{p.envio || "Envío estándar"}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{fmtCLP(p.precio)}</span>
                <button
                  data-id={p.id}
                  onClick={() => agregar(p)}
                  className="btn-primary rounded-xl px-3 py-1.5 text-sm"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Borde animado sutil */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-lime-300/70 transition" />
          </li>
        );
      })}
    </ul>
  );
}
