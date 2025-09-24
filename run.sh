#!/usr/bin/env bash
set -euo pipefail

stamp="$(date +%Y%m%d-%H%M%S)"
main_branch="main"

echo "🚀 Lunaria: mergeando último preview a ${main_branch}"

# Guardar cambios locales si los hay
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "💾 Working tree sucio → commit WIP"
  git add -A
  git commit -m "WIP: auto-save before merge (${stamp})" || true
fi

# Detectar última rama preview (local más reciente)
last_preview=$(git for-each-ref --sort=committerdate --format='%(refname:short)' refs/heads/preview/ | tail -n1)

if [[ -z "$last_preview" ]]; then
  echo "❌ No se encontró ninguna rama preview local."
  exit 1
fi

echo "🌿 Última preview detectada: $last_preview"

# Traer ramas
git fetch origin

# Checkout main
git checkout "$main_branch"
git pull origin "$main_branch"

# Merge desde preview
git merge --no-ff "$last_preview" -m "LUNARIA: merge último preview ($last_preview) a main
- Centralización de fmtCLP en lib/format.ts
- Wrapper resiliente para Supabase
- Hook de carrito + Toast
- Metadata SEO en head.tsx
- Base visual Lunaria intacta
- Documentación README.md actualizada"

# Actualizar README.md (compacto)
cat > README.md <<'MD'
# 🌙 Lunaria — Tienda Dropshipping

Tienda online construida con **Next.js (App Router)**, **Supabase** y la base visual **Lunaria**.
Optimizada para simplicidad, escalabilidad y despliegue automático en **Vercel**.

## 🚀 Características
- Next.js 13+ con App Router
- Supabase como backend
- Precios en CLP (`fmtCLP` centralizado)
- Carrito persistente (`useCart`) + Toast
- UI Lunaria: tokens, animaciones, accesibilidad
- SEO básico con `head.tsx`
- Previews automáticos en ramas `preview/...`

## 📂 Estructura
- `app/` → páginas (home, producto, head, globals.css)
- `components/` → ProductCard, ProductListClient, Hero, PreviewDebug, Toast, useCart
- `lib/` → format.ts, supabase-wrapper.ts

## 🛠️ Desarrollo local
\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`

## 🌿 Flujo Lunaria
1. `bash archivosgpt.sh`
2. `bash run.sh`
3. Revisar preview en Vercel
4. Aprobar con **“LUNARIA ok”** → merge a main
MD

git add README.md
git commit -m "docs: actualizar README.md con flujo Lunaria"

# Push a main
git push origin "$main_branch"

echo "✅ Merge completado: $last_preview → $main_branch"
echo "🔗 Producción en Vercel se actualizará automáticamente."
