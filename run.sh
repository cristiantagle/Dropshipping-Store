#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Buscando archivos relevantes..."

PRODUCT_PAGE=$(find ./app/producto -type f -path './app/producto/

\[id\]

/page.tsx' | head -n 1 || true)

echo "🧩 page.tsx (detalle producto) → ${PRODUCT_PAGE:-No encontrado}"

# Corrige app/producto/[id]/page.tsx
if [[ -n "$PRODUCT_PAGE" ]]; then
  echo "🔧 Corrigiendo comparación en page.tsx..."
  awk '
    {
      # Si busca por slug, lo cambiamos a id numérico
      gsub(/eq\(["'"'"']slug["'"'"'],\s*params\.id\)/, "eq('\''id'\'', Number(params.id))")
      # Si busca por id pero como string, lo forzamos a Number
      gsub(/eq\(["'"'"']id["'"'"'],\s*params\.id\)/, "eq('\''id'\'', Number(params.id))")
      print
    }
  ' "$PRODUCT_PAGE" > "$PRODUCT_PAGE.tmp" && mv "$PRODUCT_PAGE.tmp" "$PRODUCT_PAGE"
fi

# Git commit & push
echo "📦 Haciendo commit y push..."
git add .
git commit -m "fix: forzar page.tsx a buscar producto por id numérico"
git push

echo ""
echo "✅ Corrección aplicada y enviada a la rama actual."

echo ""
echo "📜 Changelog:"
[[ -n "$PRODUCT_PAGE" ]] && echo "- ${PRODUCT_PAGE}: comparación corregida para usar Number(params.id)"
[[ -z "$PRODUCT_PAGE" ]] && echo "- ⚠️ No se encontró page.tsx para modificar"
