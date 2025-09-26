#!/usr/bin/env bash
set -euo pipefail

<<<<<<< Updated upstream
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
=======
msg="fix: incluir branding visual"

# Detectar rama actual
current_branch=$(git branch --show-current)

if [[ "$current_branch" == "main" ]]; then
  echo "❌ Estás en main. Este flujo debe correrse desde una rama preview/*"
  exit 1
fi

echo "🧩 Guardando cambios locales en stash..."
git stash push -u -m "auto-stash before redeploy"

echo "🌿 Cambiando a main para refrescar base..."
git checkout main
git pull origin main

echo "↩️ Volviendo a la rama original: $current_branch"
git checkout "$current_branch"

echo "📦 Recuperando cambios del stash..."
git stash pop || echo "⚠️ No había nada en stash"

# Archivo fantasma para garantizar commit
touch .vercel-trigger

echo "📂 Forzando inclusión de branding visual..."
git add -f public/logos/* public/favicon.svg public/manifest.json .vercel-trigger 2>/dev/null || true

# Excluir run.sh explícitamente
git restore --staged run.sh 2>/dev/null || true

git commit -m "$msg" || echo "⚠️ No hay cambios nuevos para commitear"
git push origin "$current_branch"

echo "✅ Flujo completo ejecutado en $current_branch. Vercel redeployará con branding incluido."
>>>>>>> Stashed changes
