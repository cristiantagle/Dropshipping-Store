#!/usr/bin/env bash
set -euo pipefail

# Mensaje de commit (por defecto uno genérico si no pasas argumento)
msg=${1:-"chore: sync local fixes to preview"}

echo "🔧 Preparando commit con mensaje: $msg"

# Asegurar que estamos en un branch
branch=$(git rev-parse --abbrev-ref HEAD)
echo "📌 Branch actual: $branch"

# Agregar todos los cambios
git add .

# Crear commit
git commit -m "$msg" || echo "⚠️ No hay cambios nuevos para commitear"

# Push al branch actual
git push origin "$branch"

echo "✅ Cambios subidos a GitHub. Vercel redeployará automáticamente el preview."
