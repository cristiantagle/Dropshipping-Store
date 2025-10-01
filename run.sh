#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Corrigiendo tipo Categoria..."

# Ajusta el archivo donde está definido el tipo Categoria
# Cambia la ruta si tu tipo está en otro archivo (ej: types.ts)
FILE="lib/categorias.ts"

if grep -q "descripcion" "$FILE"; then
  echo "ℹ️ El tipo Categoria ya tiene 'descripcion'."
else
  sed -i 's/\(nombre: string;\)/\1\n  descripcion?: string;/' "$FILE"
  echo "✅ Campo 'descripcion' agregado al tipo Categoria."
fi

# 1. Guardar cambios locales
git add .
git commit -m "fix: agregar descripcion opcional a Categoria y consolidar baseline" || echo "ℹ️ No había cambios nuevos para commitear."

# 2. Cambiar a main
git checkout main

# 3. Actualizar main desde remoto
git pull origin main

# 4. Merge de la rama actual en main (si no estabas en main)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "🔗 Haciendo merge de $CURRENT_BRANCH en main..."
  git merge "$CURRENT_BRANCH"
fi

# 5. Subir main al remoto
git push origin main

echo "✅ Cambios subidos a main en remoto."
echo "🧪 Ahora Vercel debería compilar sin el error de 'descripcion'."
