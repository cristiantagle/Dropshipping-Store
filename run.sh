#!/usr/bin/env bash
set -euo pipefail

msg=${1:-"fix: corregir imports ProductDetail para build en Vercel"}

echo "🔧 Corrigiendo imports en ProductDetail.tsx..."

file="app/producto/[id]/ProductDetail.tsx"
if [[ -f "$file" ]]; then
  sed -i 's|@/utils/format|@/src/utils/format|g' "$file"
  sed -i 's|@/utils/image|@/src/utils/image|g' "$file"
  echo "✏️  Imports corregidos en $file"
fi

branch=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Branch actual: $branch"

git add .
git commit -m "$msg" || echo "⚠️ No hay cambios nuevos para commitear"
git push origin "$branch"

echo "✅ Cambios subidos. Vercel redeployará automáticamente el preview."
