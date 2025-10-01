#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Buscando console.log dentro de JSX..."

# Buscar console.log en archivos TSX y limpiar la ruta (sin el :número de línea)
FILES=$(grep -R "console.log" --include="*.tsx" app components | cut -d: -f1 | sort -u || true)

if [ -z "$FILES" ]; then
  echo "✅ No se encontraron console.log en JSX."
else
  for f in $FILES; do
    echo "⚠️  Posible console.log en JSX: $f"
    # Eliminar cualquier línea con console.log
    sed -i '/console\.log/d' "$f"
  done
  echo "✅ console.log eliminado de JSX."
fi

# 1. Guardar cambios locales
git add .
git commit -m "fix: remover console.log dentro de JSX para evitar errores de compilación" || echo "ℹ️ No había cambios nuevos para commitear."

# 2. Cambiar a main
git checkout main

# 3. Actualizar main desde remoto
git pull origin main

# 4. Subir main al remoto
git push origin main

echo "✅ Cambios subidos a main en remoto."
echo "🧪 Ahora Vercel debería compilar sin el error de console.log en JSX."
