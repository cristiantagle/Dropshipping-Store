#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Preparando commit con todos los cambios acumulados..."

# Asegurar que estamos en main
git checkout main

# Agregar todos los cambios (nuevos, modificados y eliminados)
git add -A

# Commit con mensaje que incluye fecha y hora
git commit -m "Deploy acumulado: todos los cambios hasta $(date '+%Y-%m-%d %H:%M:%S')" || echo "⚠️ Nada que commitear"

# Push a main
git push origin main

echo "✅ Cambios enviados a main. Vercel debería iniciar el deploy automáticamente."
