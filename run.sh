#!/usr/bin/env bash
set -euo pipefail

echo "🔧 LUNARIA OK → mergear ÚLTIMO preview a main"

# 0) Commit rápido de lo que tengas abierto (si hay cambios)
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "📝 Cambios locales detectados → commit rápido"
  git add -A
  git commit -m "🔧 LUNARIA: autosave antes de merge preview → main" || true
fi

# 1) Asegurarnos de tener todo lo remoto (incluye previews)
git fetch --prune origin
git fetch --prune origin '+refs/heads/preview/*:refs/remotes/origin/preview/*'

# 2) Tomar la ÚLTIMA preview por fecha de commit
LAST_PREVIEW="$(git for-each-ref \
  --sort=-committerdate \
  --format='%(refname:short)' \
  refs/remotes/origin/preview/* | head -n1 | xargs || true)"

if [ -z "${LAST_PREVIEW}" ]; then
  echo "❌ No encontré ramas preview en el remoto."
  exit 1
fi

BR_SHORT="${LAST_PREVIEW#origin/}"
echo "🧭 Última preview: $BR_SHORT"

# 3) Ir a main y actualizar
git checkout main
git pull --ff-only origin main

# 4) Merge (no fast-forward) creando commit de merge
echo "🔀 Merge $BR_SHORT → main"
git merge --no-ff "$LAST_PREVIEW" -m "🔀 LUNARIA OK: merge ${BR_SHORT} → main"

# 5) Push
echo "🚀 Push a origin/main"
git push origin main

echo "✅ Listo: ${BR_SHORT} fue mergeado a main."
