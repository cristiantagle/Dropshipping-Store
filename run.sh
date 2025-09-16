#!/bin/bash

BRANCH="preview/minimal-next-deploy"
REPO_URL="git@github.com:cristiantagle/Dropshipping-Store.git"

# Inicializar git si no está
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  git init
  git remote add origin $REPO_URL
fi

# Cambiar o crear branch de preview
if git show-ref --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git checkout -b $BRANCH
fi

# Crear carpetas base
mkdir -p pages public styles

# package.json base
cat > package.json <<'EOF'
{
  "name": "minimal-next-deploy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

# next.config.js simple sin experimental
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig
EOF

# pages/index.js con Hola Mundo
cat > pages/index.js <<'EOF'
export default function Home() {
  return <h1>Hola Mundo</h1>
}
EOF

# .gitignore para node_modules y .next
cat > .gitignore <<'EOF'
node_modules/
.next/
EOF

# Instalar dependencias
npm install

# Agregar archivos y commit
git add -A
git commit -m "Minimal Next.js setup for Vercel deploy test"
git push -u origin $BRANCH --force

echo "✅ Rama $BRANCH actualizada y push forzado listo."
echo "✔️ Ahora crea un deploy en Vercel sobre esta rama y prueba la URL."
