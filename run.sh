#!/usr/bin/env bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
BRANCH="preview/lunaria-carro-supabase-${STAMP}"

echo "🚀 Corrigiendo carro/page.tsx para usar Supabase"

# Guardar cambios locales si los hay
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "WIP: auto-save before carro fix (${STAMP})" || true
fi

git fetch origin
git checkout main
git pull origin main
git checkout -b "$BRANCH"

############################################
# 🔧 Reescribir app/carro/page.tsx
############################################

cat > app/carro/page.tsx <<'EOF'
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Producto } from "@/lib/products";
import { supabase } from "@/lib/supabase";

export default function Carro() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const key = "carro";

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar productos:", error);
        return;
      }

      setProductos(data || []);
    };

    fetchProductos();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>
      {productos.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((p) => (
            <li key={p.id}>
              <div className="border p-4 rounded shadow">
                <img src={p.imagen || p.imagen_url || p.image_url || ""} alt={p.nombre} className="w-full h-40 object-cover mb-2" />
                <h2 className="text-lg font-semibold">{p.nombre}</h2>
                <p className="text-sm text-gray-600">{p.descripcion}</p>
                <p className="text-md font-bold mt-2">${p.precio}</p>
                <p className="text-xs text-gray-500">{p.envio}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link href="/checkout" className="mt-6 inline-block bg-black text-white px-4 py-2 rounded">
        Ir al checkout
      </Link>
    </main>
  );
}
EOF

############################################
# 📝 CHANGELOG.md
############################################

{
  echo "## [$STAMP] Preview branch $BRANCH"
  echo ""
  echo "- Reescrito app/carro/page.tsx para consumir productos desde Supabase"
  echo "- Eliminado import roto de 'productos' desde lib/products"
  echo "- Usa Producto desde '@/lib/products' y fetch real con supabase.from('productos')"
  echo ""
  cat CHANGELOG.md 2>/dev/null || true
} > CHANGELOG.md

############################################
# 📦 Commit y push
############################################

git add .
git commit -m "LUNARIA: carro/page.tsx ahora usa Supabase (${STAMP})"
git push origin "$BRANCH"

echo "✅ Preview creado: $BRANCH"
echo "🔗 Revisa el despliegue en Vercel antes de aprobar."
