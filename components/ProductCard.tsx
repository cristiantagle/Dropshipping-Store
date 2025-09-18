"use client";
import type { Producto } from "../lib/products";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePreviewEnv } from "../hooks/usePreviewEnv";

function proxied(url: string) {
  const encoded = encodeURIComponent(url);
  return `/api/img?u=${encoded}`;
}

export default function ProductCard({ p, onAdd }: { p: Producto; onAdd: (id: string) => void }) {
  const isPreview = usePreviewEnv();
  const [src, setSrc] = useState(p.imagen);

  useEffect(() => {
    // En PREVIEW usamos el proxy; en producción dejamos la URL original
    setSrc(isPreview ? proxied(p.imagen) : p.imagen);
  }, [isPreview, p.imagen]);

  const handleError = () => {
    // Si fallara, caemos a un placeholder local
    setSrc("/fallback.jpg");
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="card">
      <div className="relative h-52 w-full">
        {isPreview ? (
          // PREVIEW: <img> + proxy + fallback + no-referrer
          <img
            src={src}
            alt={p.nombre}
            className="object-cover w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleError}
          />
        ) : (
          // PRODUCCIÓN: optimizado por Next/Vercel
          <Image src={src} alt={p.nombre} fill className="object-cover" onError={handleError as any} />
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-500">{p.categoria} · {p.envio}</div>
        <h3 className="font-semibold">{p.nombre}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${p.precio.toLocaleString("es-CL")}</span>
          <button onClick={() => onAdd(p.id)} className="btn btn-primary">Agregar</button>
        </div>
      </div>
    </motion.div>
  );
}
