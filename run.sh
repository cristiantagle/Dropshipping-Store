#!/usr/bin/env bash
set -euo pipefail

STAMP="$(date +%Y%m%d-%H%M%S)"
BRANCH="preview/lunaria-unifica-producto-${STAMP}"

echo "🚀 Creando rama de preview: $BRANCH"

# Guardar cambios locales si los hay
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "WIP: auto-save before preview (${STAMP})" || true
fi

git fetch origin
git checkout main
git pull origin main
git checkout -b "$BRANCH"

############################################
# 🧼 Limpieza de tipos duplicados
############################################

# 1. Reescribir lib/products.ts con interfaz centralizada
cat > lib/products.ts <<'EOF'
export interface Producto {
  id: string;
  nombre: string;
  precio?: number | null;
  descripcion?: string | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  categoria_slug?: string | null;
  destacado?: boolean | null;
  created_at?: string | null;
  ventas?: number | null;
}
EOF

# 2. Eliminar definiciones duplicadas en page.tsx y producto/[id]/page.tsx
sed -i.bak '/^type Producto /,/^}/d' app/page.tsx || true
sed -i.bak '/^type Producto /,/^}/d' app/producto/[id]/page.tsx || true
sed -i.bak '/^export type Producto /,/^}/d' components/ProductListClient.tsx || true

# 3. Reemplazar imports para que usen "@/lib/products"
FILES_TO_FIX=(
  app/page.tsx
  app/producto/[id]/page.tsx
  components/ProductListClient.tsx
)

for FILE in "${FILES_TO_FIX[@]}"; do
  sed -i.bak 's|from ".*products"|from "@/lib/products"|' "$FILE" || true
  sed -i.bak 's|from "../lib/products"|from "@/lib/products"|' "$FILE" || true
done

# 4. CHANGELOG.md
{
  echo "## [$STAMP] Preview branch $BRANCH"
  echo ""
  echo "- Unificación de tipo Producto en lib/products.ts con campos reales en español"
  echo "- Eliminadas definiciones duplicadas en page.tsx, producto/[id]/page.tsx y ProductListClient"
  echo "- Todos los imports de Producto apuntan a '@/lib/products'"
  echo ""
  cat CHANGELOG.md 2>/dev/null || true
} > CHANGELOG.md

############################################
# 📦 Commit y push
############################################

git add .
git commit -m "LUNARIA: unificación final de Producto (${STAMP})"
git push origin "$BRANCH"

echo "✅ Preview creado: $BRANCH"
echo "🔗 Revisa el despliegue en Vercel antes de aprobar."
