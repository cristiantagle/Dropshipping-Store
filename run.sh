#!/usr/bin/env bash
set -euo pipefail

echo "✍️ Reescribiendo bloque 5 (últimos archivos corregidos)..."

# ========== app/not-found.tsx ==========
cat <<'EOF' > app/not-found.tsx
"use client";

export default function NotFound() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-gray-600 mb-6">
        La página que buscas no existe o fue movida.
      </p>
      <a
        href="/"
        className="inline-block px-4 py-2 bg-lime-600 text-white rounded-lg"
      >
        Volver al inicio
      </a>
    </main>
  );
}
EOF

# ========== app/layout.tsx.bak ==========
cat <<'EOF' > app/layout.tsx.bak
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lunaria",
  description: "E-commerce sustentable",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <header className="p-4 border-b bg-white">
          <h1 className="text-xl font-bold">Lunaria</h1>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="p-4 border-t bg-white text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Lunaria
        </footer>
      </body>
    </html>
  );
}
EOF

# ========== app/page.tsx ==========
cat <<'EOF' > app/page.tsx
"use client";
import Link from "next/link";
import { getProductos } from "@/lib/products";

export default async function Home() {
  const productos = await getProductos();

  return (
    <main className="space-y-12">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
          {productos.map((m) => (
            <li key={m.id}>
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
EOF

# ========== app/producto/[id]/loading.tsx ==========
cat <<'EOF' > app/producto/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border bg-white overflow-hidden">Cargando...</div>
    </div>
  );
}
EOF

# ========== app/producto/[id]/page.tsx ==========
cat <<'EOF' > app/producto/[id]/page.tsx
"use client";
import Link from "next/link";
import { getProducto } from "@/lib/products";

export default async function Producto({ params }) {
  const prod = await getProducto(params.id);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100">
            <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h1 className="text-2xl font-bold">{prod.nombre}</h1>
          <div className="mt-3 text-2xl font-black lunaria-price">
            {Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              maximumFractionDigits: 0,
            }).format(prod.precio)}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="lunaria-cta px-5 py-3 font-semibold"
              onClick={() => alert(`Agregado: ${prod.nombre}`)}
            >
              Agregar al carrito
            </button>
            <Link className="btn-brand" href="/">Volver al inicio</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
EOF

# ========== Integración a main ==========
echo "🚀 Integrando cambios a main..."
git add .
git commit -m "fix: correcciones JSX y cierres en todos los componentes"
git push origin main

echo "✅ Bloque 5 reescrito e integrado a main correctamente."
