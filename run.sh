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

# Detectar última rama preview
last_preview=$(git branch -r --list "origin/preview/*" | sort | tail -n1 | sed 's|origin/||')
if [[ -z "$last_preview" ]]; then
  echo "❌ No se encontró ninguna rama preview en remoto."
  exit 1
fi

echo "🌿 Última preview detectada: $last_preview"

# Traer ramas
git fetch origin

# Checkout main
git checkout "$main_branch"
git pull origin "$main_branch"

# Merge fast-forward desde preview
git merge --no-ff "origin/$last_preview" -m "LUNARIA: merge último preview ($last_preview) a main
- Centralización de fmtCLP en lib/format.ts
- Wrapper resiliente para Supabase
- Hook de carrito + Toast
- Metadata SEO en head.tsx
- Base visual Lunaria intacta
- Documentación README.md actualizada"

# Actualizar README.md
cat > README.md <<'MD'
# 🌙 Lunaria — Tienda Dropshipping

Tienda online construida con **Next.js (App Router)**, **Supabase** y la base visual **Lunaria**.
Optimizada para simplicidad, escalabilidad y despliegue automático en **Vercel**.

---

## 🚀 Características principales

- **Next.js 13+** con App Router y componentes cliente/servidor.
- **Supabase** como backend (productos, categorías, usuarios).
- **Internacionalización**: precios en CLP (`fmtCLP` centralizado).
- **Carrito persistente** con hook `useCart` y feedback visual `Toast`.
- **UI Lunaria**: tokens de diseño, animaciones, accesibilidad y polish visual.
- **SEO básico** con `app/head.tsx` y metadatos Open Graph.
- **Previews automáticos** en ramas `preview/...` y merge controlado con “LUNARIA ok”.

---

## 📂 Estructura del proyecto

