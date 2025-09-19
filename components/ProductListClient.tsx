'use client';
import Image from "next/image";
import type { Producto } from "@/lib/products";

export default function ProductListClient({ items }: { items: Producto[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((p) => (
        <div key={p.id} className="rounded-xl border overflow-hidden">
          <div className="relative aspect-[4/3] bg-neutral-100">
            {p.imagen ? (
              <Image
                src={p.imagen}
                alt={p.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={false}
              />
            ) : null}
          </div>
          <div className="p-3 space-y-1">
            <div className="text-sm font-semibold line-clamp-2">{p.nombre}</div>
            <div className="text-sm">$ {p.precio.toLocaleString("es-CL")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
