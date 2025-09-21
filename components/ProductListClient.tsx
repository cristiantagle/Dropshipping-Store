"use client";
import React from "react";

export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  // campos de imagen posibles
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria?: string | null;
  categoria_slug?: string | null;
};

function pickUrl(p: Producto): string {
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image];
  const first = cands.find((v) => typeof v === "string" && (v?.trim().length ?? 0) > 0);
  return (first ?? "").toString().trim();
}
const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function fmtCLP(v?: number | null) {
  if (v == null) return "$—";
  try {
    return Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);
  } catch { return `$${v}`; }
}

export default function ProductListClient({ items }: { items: Producto[] }) {
  const base = Array.isArray(items) ? items : [];
  const [sort, setSort] = React.useState<"relevancia"|"menor"|"mayor">("relevancia");
  const sorted = React.useMemo(() => {
    const arr = [...base];
    if (sort === "menor") arr.sort((a,b) => (a.precio ?? 0) - (b.precio ?? 0));
    if (sort === "mayor") arr.sort((a,b) => (b.precio ?? 0) - (a.precio ?? 0));
    return arr;
  }, [base, sort]);

  const agregar = (p: Producto) => {
    try {
      const raw = localStorage.getItem("carro") || "[]";
      const carro = JSON.parse(raw) as Producto[];
      carro.push(p);
      localStorage.setItem("carro", JSON.stringify(carro));
      window.dispatchEvent(new Event("carro:changed"));
    } catch {}
    // feedback breve
    const el = document.createElement("div");
    el.textContent = `Agregado: ${p.nombre}`;
    el.className = "fixed z-[100] bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl shadow lunaria-enter";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  };

  if (sorted.length === 0) {
    return <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Productos</h2>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-neutral-500">Ordenar:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-xl border px-3 py-1.5 bg-white dark:bg-neutral-900"
          >
            <option value="relevancia">Relevancia</option>
            <option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((p) => {
          let src = pickUrl(p);
          if (!src && p.categoria_slug === "bienestar") src = FALLBACK;
          return (
            <li key={p.id} className="card group p-4">
              <div className="card-media aspect-[4/3] w-full mb-3">
                <img
                  src={src || FALLBACK}
                  alt={p.nombre || "Producto"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => agregar(p)}
                  className="btn-brand absolute bottom-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition"
                >
                  Agregar
                </button>
              </div>
              <h3 className="font-semibold leading-tight">{p.nombre}</h3>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-bold text-lime-700 dark:text-lime-400">{fmtCLP(p.precio ?? null)}</span>
                <span className="text-xs text-neutral-500">{p.envio || "Envío estándar"}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
