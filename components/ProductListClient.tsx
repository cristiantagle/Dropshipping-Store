"use client";
import React from "react";

export type Producto = {
  id: string;
  nombre?: string | null;
  name?: string | null;
  precio?: number | null;
  price?: number | null;

  // posibles campos de imagen
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;

  // extras opcionales
  categoria?: string | null;
  categoria_slug?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
};

type Props = {
  items?: Producto[];     // lo que usa /categorias/[slug]
  products?: Producto[];  // lo que usaba la versión anterior
};

const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickUrl(p: Producto): string {
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image];
  const first = cands.find((v) => typeof v === "string" && !!v?.trim());
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

export default function ProductListClient({ items, products }: Props) {
  const data = (Array.isArray(items) && items.length ? items : (products ?? [])).filter(Boolean);

  const agregar = (p: Producto) => {
    try {
      const raw = localStorage.getItem("carro") || "[]";
      const carro = JSON.parse(raw) as Producto[];
      carro.push(p);
      localStorage.setItem("carro", JSON.stringify(carro));
      alert(`“${p.nombre ?? p.name ?? "Producto"}” agregado al carro`);
    } catch {
      // noop
    }
  };

  if (data.length === 0) {
    return <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>;
  }

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
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

        const nombre = p.nombre ?? p.name ?? "Producto";
        const precio = p.precio ?? p.price ?? null;

        return (
          <li
            key={p.id}
            className="bg-white border rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[4/3] w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={src || FALLBACK}
                alt={nombre}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={onErr}
              />
            </div>

            <h3 className="font-semibold leading-tight">{nombre}</h3>
            <p className="text-sm text-gray-600">{p.envio || "Envío estándar"}</p>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold text-emerald-700">{fmtCLP(precio)}</span>
              <button
                className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors"
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
