#!/usr/bin/env bash
set -euo pipefail

echo "🌙 Consolidando cambios en main..."

# 1. Asegurar commit de cambios locales
git add .
git commit -m "fix: reemplazo de key={index} por key={item.id} en todo el repo" || echo "ℹ️ No había cambios nuevos para commitear."

# 2. Cambiar a main (ya estás en main, pero lo forzamos por seguridad)
git checkout main

# 3. Actualizar main desde remoto
git pull origin main

# 4. Subir main al remoto
git push origin main

echo "✅ Cambios subidos a main en remoto."
echo "🧪 Ahora Vercel debería disparar un nuevo build con el baseline corregido."
