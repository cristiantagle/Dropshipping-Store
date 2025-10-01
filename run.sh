#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Buscando key={c.id} o key={c.slug} en mapas con item..."

# Buscar en todos los .tsx
FILES=$(grep -R "key={c." --include="*.tsx" app components | cut -d: -f1 | sort -u || true)

if [ -z "$FILES" ]; then
  echo "✅ No se encontraron key={c...} en mapas con item."
else
  for f in $FILES; do
    echo "⚠️  Corrigiendo $f ..."
    sed -i 's/key={c\.id}/key={item.id}/g' "$f"
    sed -i 's/key={c\.slug}/key={item.slug}/g' "$f"
  done
  echo "✅ Reemplazos completados."
fi

# 1. Guardar cambios locales
git add .
git commit -m "fix: corregir key mal puestos (c → item) en mapas con item" || echo "ℹ️ No había cambios nuevos para commitear."

# 2. Cambiar a main
git checkout main

# 3. Actualizar main desde remoto
git pull origin main

# 4. Subir main al remoto
git push origin main

echo "✅ Cambios subidos a main en remoto."
echo "🧪 Vercel debería compilar sin el error de 'c' no definido."
