'use client';

import { useEffect, useState } from 'react';

const urls = [
  "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
];

export default function DebugImages() {
  const [status, setStatus] = useState<Record<string,string>>({});

  useEffect(() => {
    urls.forEach((u) => {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.crossOrigin = "anonymous";
      img.onload = () => setStatus(s => ({...s, [u]: "OK"}));
      img.onerror = () => setStatus(s => ({...s, [u]: "ERROR"}));
      img.src = u;
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug imágenes (Producción)</h1>
      <p className="text-gray-600">Este visor intenta cargar las imágenes externas y muestra el estado por cada URL.</p>
      <ul className="space-y-2">
        {urls.map(u => (
          <li key={u} className="break-all">
            <span className="font-mono text-sm">{u}</span>
            <span className="ml-3 inline-flex items-center rounded-full px-2 py-0.5 text-xs border">
              {status[u] ?? "cargando…"}
            </span>
          </li>
        ))}
      </ul>
      <div className="grid md:grid-cols-3 gap-4">
        {urls.map(u => (
          <div key={u} className="border rounded-lg overflow-hidden bg-white">
            <img
              src={u}
              alt="test"
              className="w-full h-48 object-cover"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="eager"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
