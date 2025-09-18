"use client";
import { useEffect, useState } from "react";

export default function DiagImages() {
  const [meta, setMeta] = useState<any>(null);
  const url = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop";
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
        <div>
          <h2 className="font-semibold mb-2">_next/image (prod):</h2>
          <img
            src={`/_next/image?url=${encodeURIComponent(url)}&w=1920&q=75`}
            alt="opt"
            className="rounded-xl border w-full h-56 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
