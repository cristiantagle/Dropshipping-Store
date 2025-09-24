#!/usr/bin/env bash
set -euo pipefail

stamp="$(date +%Y%m%d-%H%M%S)"
branch="preview/lunaria-update-${stamp}"

echo "🚀 Lunaria: preparando preview con mejoras"
echo "🧹 Revisando working tree…"

# Guardar cambios locales en commit WIP si hay
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "💾 Working tree sucio → commit WIP"
  git add -A
  git commit -m "WIP: auto-save before lunaria update (${stamp})" || true
fi

echo "🌿 Creando rama → ${branch}"
git checkout -b "${branch}"

# ==== Archivos nuevos/modificados ====

mkdir -p lib hooks components

# lib/format.ts
cat > lib/format.ts <<'TS'
// Utilidad para formatear CLP
export function fmtCLP(value: number | string | null | undefined): string {
  const n = value == null ? 0 : Number(value);
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return (n === 0) ? "$0" : String(n);
  }
}
TS

# lib/supabase-wrapper.ts
cat > lib/supabase-wrapper.ts <<'TS'
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseClient = createClient(url, key, { auth: { persistSession: false } });

export async function supabaseFetch<T>(
  fn: (c: ReturnType<typeof createClient>) => Promise<T>,
  retries = 2
): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn(supabaseClient as any);
    } catch (err) {
      lastError = err;
      console.warn("Supabase fetch failed, intento", i + 1, err);
      await new Promise(r => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastError;
}
TS

# components/useCart.tsx
cat > components/useCart.tsx <<'TS'
'use client';
import { useState, useEffect } from "react";

export function useCart() {
  const [items, setItems] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem("carro") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("carro", JSON.stringify(items));
    window.dispatchEvent(new Event("carro:updated"));
  }, [items]);

  function add(item: any) {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: (p.qty || 1) + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
  }
  function remove(id: string) { setItems(prev => prev.filter(p => p.id !== id)); }
  function clear() { setItems([]); }

  return { items, add, remove, clear };
}
TS

# components/Toast.tsx
cat > components/Toast.tsx <<'TS'
'use client';
import React from "react";

export function Toast({ message }: { message: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 bg-black/80 text-white px-4 py-2 rounded-xl shadow-lg text-sm"
    >
      {message}
    </div>
  );
}
TS

# app/head.tsx
cat > app/head.tsx <<'TS'
export default function Head() {
  return (
    <>
      <title>Lunaria — Tienda</title>
      <meta name="description" content="Tienda dropshipping simple y bonita" />
      <meta property="og:title" content="Lunaria" />
      <meta property="og:description" content="Productos útiles y bonitos con envío simple" />
      <meta property="og:type" content="website" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="theme-color" content="#2ECC71" />
    </>
  );
}
TS

echo "🧾 Archivos escritos."

# ==== Commit & push ====
git add -A
git commit -m "LUNARIA: mejoras (fmtCLP util, wrapper Supabase, carrito+toast, head SEO)"
git push -u origin "${branch}"

echo "✅ Listo. Se subió ${branch}."
echo "🔗 Vercel debería levantar un Preview automáticamente."
echo "👉 Cuando lo apruebes, di: LUNARIA ok"
