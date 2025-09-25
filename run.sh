#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Buscando archivos con queries que usen params.id..."

# Buscar todos los archivos .ts o .tsx que contengan "params.id"
FILES=$(grep -rl "params.id" --include=\*.ts --include=\*.tsx ./app || true)

if [[ -z "$FILES" ]]; then
  echo "⚠️ No se encontraron archivos con params.id en ./app"
else
  for f in $FILES; do
    echo "🔧 Corrigiendo $f ..."
    awk '
      {
        # Si busca por slug, lo cambiamos a id numérico
        gsub(/eq\(["'"'"']slug["'"'"'],\s*params\.id\)/, "eq('\''id'\'', Number(params.id))")
        # Si busca por id pero como string, lo forzamos a Number
        gsub(/eq\(["'"'"']id["'"'"'],\s*params\.id\)/, "eq('\''id'\'', Number(params.id))")
        print
      }
    ' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  done
fi

# Git commit & push
echo "📦 Haciendo commit y push..."
git add .
git commit -m "fix: forzar todas las queries con params.id a usar Number(params.id)"
git push

echo ""
echo "✅ Correcciones aplicadas y enviadas a la rama actual."

echo ""
echo "📜 Changelog:"
if [[ -n "$FILES" ]]; then
  for f in $FILES; do
    echo "- $f: queries corregidas para usar Number(params.id)"
  done
else
  echo "- ⚠️ No se encontraron archivos para modificar"
fi
