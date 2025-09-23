'use client';
import Link from "next/link";

type Props = {
  id: string;
  nombre: string;
  precio?: number | null;
  envio?: string;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  href?: string;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickImg(p: Props) {
  const toStr = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image].map(toStr).filter(Boolean);
  return cands[0] || FALLBACK;
}
function fmtCLP(v?: number | null) {
  if (v == null) return "$—";
  try {
    return Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);
  } catch { return `$${v}`; }
}

export default function ProductCard(props: Props){
  const src = pickImg(props);
  const url = props.href || `/producto/${props.id}`;
  return (
    <Link href={url} className="block rounded-2xl border overflow-hidden bg-white group card-3d">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={src}
          alt={props.nombre || "Producto"}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
          loading="lazy" decoding="async" referrerPolicy="no-referrer"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.dataset.fallbackApplied !== "1") { img.dataset.fallbackApplied = "1"; img.src = FALLBACK; }
          }}
        />
      </div>
      <div className="p-3">
        <div className="lunaria-title text-sm line-clamp-1">{props.nombre}</div>
        <div className="mt-1 flex items-center justify-between">
          <span className="lunaria-price text-sm">{fmtCLP(props.precio)}</span>
          <span className="badge text-[11px]">{props.envio || "Envío estándar"}</span>
        </div>
      </div>
    </Link>
  );
}
