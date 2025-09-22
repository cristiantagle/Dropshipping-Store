"use client";
import React from "react";
export type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  envio?: string | null;
  categoria_slug?: string | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
};
const FALLBACK = "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";
function pickUrl(p: Producto): string {
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image].filter(Boolean) as string[];
  let first = (cands.find((s) => (s || "").trim().length > 0) || "").trim();
  if (!first && p.categoria_slug === "bienestar") first = FALLBACK;
  return first || FALLBACK;
}
function fmtCLP(v?: number | null) {
  if (v == null) return "$—";
  try { return Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v); }
  catch { return `$${v}`; }
}
function useImgLoaded() {
  const [loaded, setLoaded] = React.useState(false);
  const onLoad = React.useCallback(() => setLoaded(true), []);
  const onError = React.useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget; if (img.src !== FALLBACK) img.src = FALLBACK; else setLoaded(true);
  }, []);
  return { loaded, onLoad, onError };
}
function Card({ p }: { p: Producto }) {
  const { loaded, onLoad, onError } = useImgLoaded();
  const src = pickUrl(p);
  const agregar = () => {
    try {
      const raw = localStorage.getItem("carro") || "[]";
      const carro = JSON.parse(raw); carro.push(p);
      localStorage.setItem("carro", JSON.stringify(carro));
      window.dispatchEvent(new StorageEvent("storage", { key: "carro" }));
    } catch {}
    window.dispatchEvent(new CustomEvent("toast", { detail: { message: `“${p.nombre}” agregado al carro` } }));
  };
  return (
    <li className="border rounded-2xl p-4 hover:shadow-md transition bg-white">
      <div className="aspect-[4/3] w-full mb-3 overflow-hidden rounded-xl bg-gray-100 relative">
        {!loaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={src}
          alt={p.nombre || "Producto"}
          className={`w-full h-full object-cover ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          loading="lazy" decoding="async" referrerPolicy="no-referrer"
          onLoad={onLoad} onError={onError}
        />
      </div>
      <h3 className="font-semibold leading-tight line-clamp-2">{p.nombre}</h3>
      <p className="text-sm text-gray-600">{p.envio || "Envío estándar"}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold">{fmtCLP(p.precio ?? null)}</span>
        <button className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700 active:scale-[0.98] transition" onClick={agregar}>Agregar</button>
      </div>
    </li>
  );
}
export default function ProductListClient({ items }: { items: Producto[] }) {
  const data = Array.isArray(items) ? items : [];
  if (data.length === 0) return <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>;
  return <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{data.map((p) => <Card key={p.id} p={p} />)}</ul>;
}
