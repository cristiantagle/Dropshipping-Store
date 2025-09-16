#!/bin/bash

BRANCH="preview/reset-basic-structure"

# Cambiar a la rama preview, crear si no existe
if git show-ref --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git checkout -b $BRANCH
fi

# Eliminar vercel.json si existe
if [ -f vercel.json ]; then
  rm vercel.json
fi

# Mantener /pages/index.js mínimo
cat > pages/index.js <<'TS'
export default function Home() {
  return <h1>Hola Mundo</h1>;
}
TS

# Agregar y commitear cambios
git add -A
git commit -m "Eliminar vercel.json para probar deploy limpio con Hola Mundo"
git push -u origin $BRANCH

echo "✅ Archivo vercel.json eliminado, push a $BRANCH listo. Revisa deploy en Vercel."
