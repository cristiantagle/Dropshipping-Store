#!/bin/bash

echo "💾 Guardando cambios locales (stash si hay)…"
git stash push -m "auto-stash-before-preview" || true

echo "🔀 Cambiando a main y actualizando (ff-only)…"
git checkout main
git pull --ff-only origin main

branch="preview/fix-categorias-12-items-images-$(date +%Y%m%d-%H%M%S)"
echo "🌱 Creando rama $branch…"
git checkout -b "$branch"

# 🔁 Traer de vuelta lo stasheado si existe
if git stash list | grep -q "auto-stash-before-preview"; then
  echo "📦 Aplicando stash…"
  git stash pop || true
else
  echo "ℹ️ No hay stash para aplicar."
fi

echo "📄 Añadiendo cambios…"
git add -A

# Si no hay cambios reales, forzamos un ping para que Vercel construya igual
if git diff --cached --quiet; then
  echo "⚠️  No hay cambios staged; creando PREVIEW_PING.md para forzar build…"
  echo "# Preview ping $(date -u +"%Y-%m-%d %H:%M:%S UTC")" > PREVIEW_PING.md
  git add PREVIEW_PING.md
fi

echo "📝 Commit…"
git commit -m "chore: preview build (cats 12 + images) $(date -u +"%Y-%m-%d %H:%M:%S UTC")"

echo "📤 Push a remoto…"
git push -u origin "$branch"

echo "✅ Rama lista: $branch"
echo "🔗 PR: https://github.com/cristiantagle/Dropshipping-Store/pull/new/$branch"
echo "🧪 Rutas a probar:"
echo "   /categorias/hogar"
echo "   /categorias/belleza"
echo "   /categorias/tecnologia"
echo "   /categorias/bienestar"
echo "   /categorias/eco"
echo "   /categorias/mascotas"
