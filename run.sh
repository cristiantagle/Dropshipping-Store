#!/usr/bin/env bash
# run.sh — Promoción de la rama preview actual a main (con respaldo) [LUNARIA]
set -Eeuo pipefail

say(){ printf "\n\033[1;36m%s\033[0m\n" "$*"; }

REMOTE="origin"
TS="$(date +%Y%m%d-%H%M%S)"

# 1) Detectar rama fuente
CURRENT="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")"
if [[ "$CURRENT" != preview/* ]]; then
  # Intentar tomar la última preview por fecha si no estamos parados en una
  CANDIDATE="$(git for-each-ref --format='%(refname:short) %(committerdate:iso)' --sort=-committerdate refs/heads/preview/ | awk 'NR==1{print $1}')"
  if [[ -z "${CANDIDATE:-}" ]]; then
    echo "❌ No se encontró ninguna rama preview/*. Párete en la rama preview a promover y vuelve a correr."
    exit 1
  fi
  CURRENT="$CANDIDATE"
fi

say "🔎 Rama a promover: $CURRENT"

# 2) Guardar cambios locales (si los hay)
say "💾 Stash/commit WIP si hay cambios…"
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A || true
  git commit -m "WIP: autosave antes de promover $CURRENT ($TS)" || true
fi

# 3) Asegurar identidad git mínima
git config user.email >/dev/null 2>&1 || git config user.email "bot@local"
git config user.name  >/dev/null 2>&1 || git config user.name  "Automation Bot"

# 4) Actualizar main
say "🌿 Checkout main (crear si no existe) y actualizar…"
git checkout main >/dev/null 2>&1 || git checkout -b main
git fetch "$REMOTE" --prune >/dev/null 2>&1 || true
git merge --ff-only "refs/remotes/$REMOTE/main" >/dev/null 2>&1 || true

# 5) Respaldo
BACKUP="legacy/backup-before-promote-${TS}"
say "🛟 Creando respaldo ${BACKUP} desde main…"
git branch -f "$BACKUP" main
git push -u "$REMOTE" "$BACKUP" >/dev/null 2>&1 || true

# 6) Merge no-ff de la preview → main
say "🔀 Haciendo merge no-ff de ${CURRENT} → main…"
git merge --no-ff "$CURRENT" -m "merge: promote ${CURRENT} → main [LUNARIA]" || {
  echo "❌ Conflictos en merge. Resuélvelos y vuelve a correr."
  exit 1
}

# 7) Asegurar que .next no quede trackeado
say "🧹 Asegurando que .next no quede en el índice…"
echo -e "\n# Next build\n.next/" >> .gitignore || true
git rm -r --cached .next >/dev/null 2>&1 || true

# 8) Push a main
say "🚀 Push a origin/main…"
git push "$REMOTE" main

# 9) Info final
REPO_URL="$(git remote get-url "$REMOTE" | sed -E 's#(git@|https://)github.com[:/]{1}([^/]+/[^/.]+).*#https://github.com/\2#')"
echo
echo "✅ Promoción lista: ${CURRENT} → main"
echo "🔗 Repo: ${REPO_URL}"
echo "📝 Si Vercel está apuntado a main, desplegará producción automáticamente."
