"use client";
import { useEffect, useState } from "react";

export default function DiagImages() {
  const [meta, setMeta] = useState<any>(null);
  const url = "/lunaria-icon.png";
  useEffect(() => {
    fetch("/api/health").then(r=>r.json()).then(setMeta).catch(()=>{});
  }, []);
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">Diagnóstico imágenes</h1>
      <pre className="p-3 bg-gray-50 border rounded-xl text-sm overflow-auto">{JSON.stringify(meta, null, 2)}</pre>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">IMG directa (preview):</h2>
          <img src={url} alt="unsplash" className="rounded-xl border w-full h-56 object-cover" />
        </div>
          <h2 className="font-semibold mb-2">_next/imagen (prod):</h2>
          <img
            src={`/_next/imagen?url=${encodeURIComponent(url)}&w=1920&q=75`}
            alt="opt"
            className="rounded-xl border w-full h-56 object-cover"
          />
      </div>
    </div>
  );
}
