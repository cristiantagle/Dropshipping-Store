"use client";
import type { Producto } from "@/lib/products";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function proxied(url: string) { return `/api/img?u=${encodeURIComponent(url)}`; }

export default function ProductCard({ p, onAdd }: { p: Producto; onAdd: (id: string) => void }) {
  const [src, setSrc] = useState(p.imagen);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    fetch("/api/health").then(r=>r.json()).then((d:any)=>{
      setIsPreview(d?.env === "preview");
      setSrc(d?.env === "preview" ? proxied(p.imagen) : p.imagen);
    }).catch(()=>{
      setIsPreview(false);
      setSrc(p.imagen);
    });
  }, [p.imagen]);

  const handleError = () => setSrc("/fallback.jpg");

  return (
    <motion.div whileHover={{ y: -4 }} className="card">
      <div className="relative h-52 w-full">
        {isPreview ? (
          <img src={src} alt={p.nombre} className="object-cover w-full h-full" loading="lazy" referrerPolicy="no-referrer" onError={handleError}/>
        ) : (
          <Image src={src} alt={p.nombre} fill className="object-cover" onError={handleError as any}/>
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
