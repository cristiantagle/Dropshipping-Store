#!/bin/bash

BRANCH="preview/app-router-migration"

# Cambiar o crear rama preview/app-router-migration
if git show-ref --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git checkout -b $BRANCH
fi

# Crear carpeta app y archivo minimal page.tsx
mkdir -p app
cat > app/page.tsx <<'TS'
export default function Home() {
  return <h1>Hola Mundo - App Router</h1>;
}
TS

# Renombrar carpeta pages si existe para evitar conflictos
if [ -d pages ]; then
  mv pages pages_backup
fi

# Actualizar next.config.js para quitar experimental.appDir
cat > next.config.js <<'TS'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig;
TS

# Agregar y commitear cambios
git add -A
git commit -m "Migración a App Router: Crear carpeta app y page.tsx, renombrar pages"
git push -u origin $BRANCH --force

echo "✅ Migración a App Router realizada, push a $BRANCH listo. Despliega esta rama en Vercel y prueba el deploy."
