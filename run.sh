#!/bin/bash

BRANCH="preview/app-router-full-setup"

# Cambiar o crear la rama
if git show-ref --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git checkout -b $BRANCH
fi

# Crear carpetas base
mkdir -p app lib styles

# next.config.js copia del que funciona
cat > next.config.js <<'TS'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: { formats: ['image/avif', 'image/webp'] },
}
module.exports = nextConfig
TS

# package.json básico basado en el que funciona
cat > package.json <<'JSON'
{
  "name": "oretec-compatible-setup",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings=0",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@supabase/supabase-js": "^2.45.4",
    "framer-motion": "^10.18.0",
    "lucide-react": "^0.441.0",
    "next": "^14.2.32",
    "pg": "8.16.3",
    "react": "18.2.0",
    "react-countup": "^6.5.3",
    "react-dom": "18.2.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "20.11.30",
    "@types/pg": "8.15.5",
    "@types/qrcode": "^1.5.5",
    "@types/react": "18.2.66",
    "@types/react-dom": "18.2.22",
    "@typescript-eslint/eslint-plugin": "7.2.0",
    "@typescript-eslint/parser": "7.2.0",
    "autoprefixer": "10.4.18",
    "dotenv": "^17.2.2",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "8.4.35",
    "supabase": "^2.39.2",
    "tailwindcss": "3.4.4",
    "typescript": "5.4.5"
  }
}
JSON

# .gitignore con node_modules, .next y env files
cat > .gitignore <<'TXT'
node_modules/
.next/
.env.local
.env.vercel
TXT

# app/layout.tsx básico para Next.js App Router
cat > app/layout.tsx <<'TSX'
import './globals.css'

export const metadata = {
  title: 'Proyecto OreTec Compatible',
  description: 'Base compatible con OreTec para deploy en Vercel sin 404.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
TSX

# app/page.tsx mínimo con mensaje de prueba
cat > app/page.tsx <<'TSX'
export default function Home() {
  return <h1>Prueba de página base - Compatible OreTec</h1>
}
TSX

# middleware.ts base (vacío o con ejemplo simple)
cat > middleware.ts <<'TS'
import { NextResponse } from 'next/server'

export function middleware(request) {
  // dejar pasar sin bloqueo
  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'], // fila para ignorar rutas estáticas y API
}
TS

# .env.local base (vacío o con variables de entorno de ejemplo)
cat > .env.local <<'ENV'
# Variables de entorno de ejemplo
NEXT_PUBLIC_SAMPLE=valor
ENV

# .env.vercel con mínimo
cat > .env.vercel <<'ENV'
NEXT_PUBLIC_SAMPLE=valor
ENV

# Instalar dependencias
npm install

# Git add y commit
git add -A
git commit -m "Setup base compatible OreTec: App Router, middleware, env y config"
git push -u origin $BRANCH --force

echo "✅ Setup completo en la rama $BRANCH listo!"
echo "👉 Despliega esta rama en Vercel y verifica el resultado."
