#!/usr/bin/env bash
set -euo pipefail

msg=${1:-"fix: corregir imports '@/src/utils' -> '@/utils' para Vercel"}

echo "🔧 Corrigiendo imports rotos en el repo..."

# Buscar y reemplazar en todos los .tsx y .ts
grep -RIl '@/src/utils/' . --include="*.ts" --include="*.tsx" | while read -r file; do
  echo "✏️  Corrigiendo $file"
  sed -i 's|@/src/utils/|@/utils/|g' "$file"
done

echo "📌 Preparando commit con mensaje: $msg"

branch=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Branch actual: $branch"

git add .
git commit -m "$msg" || echo "⚠️ No hay cambios nuevos para commitear"
git push origin "$branch"

echo "✅ Cambios subidos. Vercel redeployará automáticamente el preview."
