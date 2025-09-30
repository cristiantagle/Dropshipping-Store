#!/usr/bin/env bash
set -euo pipefail

# Nombre de la rama actual
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🌙 Rama actual: $CURRENT_BRANCH"

# 1. Guardar cambios locales
echo "📦 Haciendo commit de cambios locales..."
git add .
git commit -m "fix: baseline estable sin errores de client/server" || echo "ℹ️ No había cambios nuevos para commitear."

# 2. Cambiar a main
echo "🔀 Cambiando a main..."
git checkout main

# 3. Actualizar main desde remoto
echo "⬇️  Actualizando main desde origin..."
git pull origin main

# 4. Hacer merge de la rama actual en main
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "🔗 Haciendo merge de $CURRENT_BRANCH en main..."
  git merge "$CURRENT_BRANCH"
fi

# 5. Subir main al remoto
echo "⬆️  Pusheando main a origin..."
git push origin main

echo "✅ Listo. Tu rama main ahora contiene el estado estable que tenías en $CURRENT_BRANCH."
