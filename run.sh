#!/usr/bin/env bash
set -euo pipefail

msg=${1:-"chore: diagnosticar ubicación de fmtCLP y pickImage"}

echo "🔎 Buscando definiciones de fmtCLP y pickImage en el repo..."

# Buscar fmtCLP
echo -e "\n=== Resultados para fmtCLP ==="
grep -RIn "fmtCLP" . || echo "⚠️ No se encontró fmtCLP"

# Buscar pickImage
echo -e "\n=== Resultados para pickImage ==="
grep -RIn "pickImage" . || echo "⚠️ No se encontró pickImage"

# Mostrar branch actual
branch=$(git rev-parse --abbrev-ref HEAD)
echo -e "\n🌿 Branch actual: $branch"

# Commit opcional (solo si quieres registrar el diagnóstico)
git add -A
git commit -m "$msg" || echo "⚠️ No hay cambios nuevos para commitear"
git push origin "$branch"

echo -e "\n✅ Diagnóstico completado. Revisa arriba las rutas exactas."
