#!/usr/bin/env bash
set -euo pipefail

msg=${1:-"chore: diagnosticar ubicación de fmtCLP y pickImage"}

echo "🔎 Buscando definiciones de fmtCLP y pickImage en el repo..."

echo -e "\n=== fmtCLP ==="
grep -RIn "fmtCLP" . || echo "⚠️ No se encontró fmtCLP"

echo -e "\n=== pickImage ==="
grep -RIn "pickImage" . || echo "⚠️ No se encontró pickImage"

branch=$(git rev-parse --abbrev-ref HEAD)
echo -e "\n🌿 Branch actual: $branch"

git add -A
git commit -m "$msg" || echo "⚠️ No hay cambios nuevos para commitear"
git push origin "$branch"

echo -e "\n✅ Diagnóstico completado. Revisa arriba las rutas exactas."
