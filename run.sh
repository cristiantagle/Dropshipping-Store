#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Buscando usos incorrectos de key={item...} en JSX..."

# Buscar en todos los .tsx
FILES=$(grep -R "key={item" --include="*.tsx" app components | cut -d: -f1 | sort -u || true)

if [ -z "$FILES" ]; then
  echo "✅ No se encontraron key={item...} en el repo."
else
  for f in $FILES; do
    echo "⚠️  Corrigiendo $f ..."
    # Reemplazar key={item.id} por key={c.id}
    sed -i 's/key={item\.id}/key={c.id}/g' "$f"
    sed -i 's/key={item\.slug}/key={c.slug}/g' "$f"
  done
  echo "✅ Reemplazos completados."
fi

# 1. Guardar cambios locales
git add .
git commit -m "fix: corregir key mal puestos (item → c) en JSX maps" || echo "ℹ️ No había cambios nuevos para commitear."

# 2. Cambiar a main
git checkout main

# 3. Actualizar main desde remoto
git pull origin main

# 4. Subir main al remoto
git push origin main

echo "✅ Cambios subidos a main en remoto."
echo "🧪 Ahora Vercel debería compilar sin el error de 'item' no definido."
