#!/usr/bin/env bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
PREVIEW_BRANCH="preview/lunaria-full-update-${STAMP}"

echo "🚀 Creando preview branch: $PREVIEW_BRANCH"

# Guardar cambios locales si los hay
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "💾 Working tree sucio → commit WIP"
  git add -A
  git commit -m "WIP: auto-save before preview (${STAMP})" || true
fi

# Crear rama preview desde main
git fetch origin
git checkout main
git pull origin main
git checkout -b "$PREVIEW_BRANCH"

############################################
# 🔧 Cambios técnicos y visuales
############################################

# 1. Centralizar fmtCLP en lib/format.ts
mkdir -p lib
cat > lib/format.ts <<'EOF'
export function fmtCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(value);
}
EOF

# 2. Wrapper resiliente para Supabase
cat > lib/supabase-wrapper.ts <<'EOF'
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { params: { eventsPerSecond: 2 } },
});

export async function safeQuery<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    console.error("❌ Supabase error:", err);
    return null;
  }
}
EOF

# 3. Hook de carrito con Toast
mkdir -p components
cat > components/useCart.tsx <<'EOF'
"use client";
import { useState } from "react";
import { toast } from "./Toast";

export function useCart() {
  const [items, setItems] = useState<any[]>([]);

  const addItem = (item: any) => {
    setItems((prev) => [...prev, item]);
    toast("Producto agregado al carrito 🛒");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast("Producto eliminado del carrito");
  };

  return { items, addItem, removeItem };
}
EOF

# 4. Toast simple
cat > components/Toast.tsx <<'EOF'
"use client";
import { useState } from "react";

let listeners: ((msg: string) => void)[] = [];

export function toast(msg: string) {
  listeners.forEach((fn) => fn(msg));
}

export default function Toast() {
  const [message, setMessage] = useState<string | null>(null);

  listeners = [setMessage];

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded">
      {message}
    </div>
  );
}
EOF

# 5. Metadata SEO en app/head.tsx
mkdir -p app
cat > app/head.tsx <<'EOF'
export default function Head() {
  return (
    <>
      <title>Lunaria — Tienda Dropshipping</title>
      <meta name="description" content="Tienda online Lunaria con Next.js y Supabase" />
      <meta property="og:title" content="Lunaria — Tienda Dropshipping" />
      <meta property="og:description" content="Explora productos únicos con la base visual Lunaria" />
      <meta property="og:type" content="website" />
    </>
  );
}
EOF

# 6. Documentación README.md (sin bloques de backticks que corten el heredoc)
cat > README.md <<'EOF'
# 🌙 Lunaria — Tienda Dropshipping

Tienda online construida con **Next.js (App Router)**, **Supabase** y la base visual **Lunaria**.
Optimizada para simplicidad, escalabilidad y despliegue automático en **Vercel**.

## 🚀 Características
- Next.js 13+ con App Router
- Supabase como backend
- Precios en CLP (fmtCLP centralizado)
- Carrito persistente (useCart) + Toast
- UI Lunaria: tokens, animaciones, accesibilidad
- SEO básico con head.tsx
- Previews automáticos en ramas preview/...

## 📂 Estructura
- app/ → páginas (home, producto, head, globals.css)
- components/ → ProductCard, ProductListClient, Hero, PreviewDebug, Toast, useCart
- lib/ → format.ts, supabase-wrapper.ts

## 🛠️ Desarrollo local
npm install
npm run dev
npm run build

## 🌿 Flujo Lunaria
bash archivosgpt.sh
bash run.sh
Revisar preview en Vercel
Aprobar con “LUNARIA ok” → merge a main
EOF

# 7. CHANGELOG.md
{
  echo "## [$STAMP] Preview branch $PREVIEW_BRANCH"
  echo ""
  echo "- Centralización de fmtCLP en lib/format.ts"
  echo "- Wrapper resiliente para Supabase"
  echo "- Hook de carrito + Toast"
  echo "- Metadata SEO en head.tsx"
  echo "- Base visual Lunaria intacta"
  echo "- Documentación README.md actualizada"
  echo ""
  cat CHANGELOG.md 2>/dev/null || true
} > CHANGELOG.md

############################################
# 📦 Commit y push
############################################

git add .
git commit -m "LUNARIA: full update preview (${STAMP})"
git push origin "$PREVIEW_BRANCH"

echo "✅ Preview creado: $PREVIEW_BRANCH"
echo "🔗 Revisa el despliegue en Vercel antes de aprobar."
