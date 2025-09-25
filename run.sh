#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Buscando archivos relevantes..."

PRODUCT_CARD=$(find . -type f -name 'ProductCard.tsx' | head -n 1 || true)
PRODUCT_PAGE=$(find . -type f -path './app/producto/[id]/page.tsx' | head -n 1 || true)

echo "🧩 ProductCard.tsx → ${PRODUCT_CARD:-No encontrado}"
echo "🧩 page.tsx (detalle producto) → ${PRODUCT_PAGE:-No encontrado}"

# Corrige ProductCard.tsx
if [[ -n "$PRODUCT_CARD" ]]; then
  echo "🔧 Corrigiendo link en ProductCard.tsx..."
  awk '
    {
      gsub(/href={`\/producto\/\$\{producto\.nombre\}`}/, "href={`/producto/${producto.id}`}")
      gsub(/href={`\/producto\/\$\{producto\.slug\}`}/, "href={`/producto/${producto.id}`}")
      print
    }
  ' "$PRODUCT_CARD" > "$PRODUCT_CARD.tmp" && mv "$PRODUCT_CARD.tmp" "$PRODUCT_CARD"
fi

# Corrige app/producto/[id]/page.tsx
if [[ -n "$PRODUCT_PAGE" ]]; then
  echo "🔧 Corrigiendo comparación en page.tsx..."
  awk '
    {
      gsub(/eq\(["'"'"']id["'"'"'],\s*params\.id\)/, "eq('\''id'\'', Number(params.id))")
      print
    }
  ' "$PRODUCT_PAGE" > "$PRODUCT_PAGE.tmp" && mv "$PRODUCT_PAGE.tmp" "$PRODUCT_PAGE"
fi

# Git commit & push
echo "📦 Haciendo commit y push..."
git add .
git commit -m "fix: corregir ProductCard y page.tsx para usar producto.id y Number(params.id)"
git push

echo ""
echo "✅ Correcciones aplicadas y enviadas a la rama actual."

echo ""
echo "📜 Changelog:"
[[ -n "$PRODUCT_CARD" ]] && echo "- ${PRODUCT_CARD}: link corregido para usar producto.id"
[[ -n "$PRODUCT_PAGE" ]] && echo "- ${PRODUCT_PAGE}: comparación corregida para usar Number(params.id)"
[[ -z "$PRODUCT_CARD" && -z "$PRODUCT_PAGE" ]] && echo "- ⚠️ No se encontraron archivos para modificar"
