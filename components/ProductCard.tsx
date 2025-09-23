'use client';
import Link from "next/link";

export type ProductCardProps = {
  id: string;
  nombre: string;
  precio?: number | null;
  envio?: string | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  href?: string;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickUrl(p: ProductCardProps) {
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image];
  const first = cands.find((v) => typeof v === "string" && v.trim().length > 0);
  return (first ?? "").toString().trim() || FALLBACK;
}

function fmtCLP(v?: number | null) {
  if (v == null) return "$—";
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(v);
  } catch {
    return `$${v ?? ""}`;
  }
}

export default function ProductCard(props: ProductCardProps) {
  const src = pickUrl(props);
  const body = (
    <div className="rounded-2xl border bg-white overflow-hidden group">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={src}
          alt={props.nombre || "Producto"}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition"
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
      <div className="p-3">
        <div className="text-sm font-semibold line-clamp-1 lunaria-title">{props.nombre}</div>
        <div className="mt-1 text-xs text-gray-600 badge">{props.envio || "Envío estándar"}</div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-extrabold lunaria-price text-sm">{fmtCLP(props.precio)}</span>
          <button
            className="px-3 py-1.5 rounded-xl lunaria-cta text-xs"
            onClick={() => alert(`Agregado: ${props.nombre}`)}
            aria-label={`Agregar ${props.nombre} al carro`}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );

  if (props.href) return <Link href={props.href} className="block">{body}</Link>;
  return body;
}
