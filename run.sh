#!/usr/bin/env bash
set -euo pipefail

# ------------------------------
# LUNARIA preview helper (fixed)
# ------------------------------

# Uso:
#   bash run.sh                    # crea rama preview con nombre automático
#   bash run.sh home-ui-polish     # crea rama preview/home-ui-polish-YYYYmmdd-HHMMSS
#
# Requisitos:
#   - Estar dentro del repo git correcto
#   - Tener remoto "origin" apuntando a GitHub
#
# Qué hace:
#   1) Guarda STASH si el árbol está sucio
#   2) Cambia a main y hace pull
#   3) Crea rama preview/<NOMBRE>-<timestamp> desde main
#   4) **Restaura el STASH**
#   5) git add/commit/push (solo si hay cambios)
#   6) Muestra instrucciones para abrir el PR/preview

green(){ printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }
red(){ printf "\033[31m%s\033[0m\n" "$*"; }
info(){ printf "ℹ %s\n" "$*"; }
ok(){ printf "✅ %s\n" "$*"; }
step(){ printf "🛠  %s\n" "$*"; }

# 0) Nombre de rama
BASE=${1:-"auto"}
TS=$(date +"%Y%m%d-%H%M%S")
BRANCH="preview/${BASE}-${TS}"

# 1) Stash si hay cambios
NEEDS_STASH=0
if [[ -n "$(git status --porcelain)" ]]; then
  step "Working tree sucio → guardando STASH temporal…"
  git stash push -u -m "tmp-stash-preview-${TS}" >/dev/null
  NEEDS_STASH=1
  ok "Stash guardado."
else
  info "Working tree limpio."
fi

# 2) Sincronizar main
step "Cambiando a main y actualizando…"
git checkout main >/dev/null
git fetch origin main --quiet
git pull --ff-only origin main >/dev/null || true
ok "main actualizado."

# 3) Crear rama preview desde main
step "Creando rama: ${BRANCH}"
git checkout -b "${BRANCH}" >/dev/null
ok "Rama creada."

# 4) Restaurar STASH **ANTES** de add/commit/push
if [[ $NEEDS_STASH -eq 1 ]]; then
  step "Restaurando STASH…"
  # --index por si había staged; si choca, intenta pop normal
  if git stash pop --index >/dev/null 2>&1; then
    :
  else
    git stash pop >/dev/null || true
  fi
  ok "Stash restaurado."
else
  info "No había stash que restaurar."
fi

# 5) Añadir y commitear SOLO si hay cambios
if [[ -n "$(git status --porcelain)" ]]; then
  step "Añadiendo cambios…"
  git add -A

  # Mensaje de commit informativo
  MSG="LUNARIA preview: ${BASE} (${TS})"
  git commit -m "${MSG}" >/dev/null || true

  step "Pusheando ${BRANCH}…"
  git push -u origin "${BRANCH}" >/dev/null

  ok "Rama subida: ${BRANCH}"
  echo
  green "➡ Abre el PR en GitHub:"
  echo "   https://github.com/$(git config --get remote.origin.url \
        | sed -E 's#(git@|https://)github.com[:/]|\.git##g')/pull/new/${BRANCH}"
  echo
  info "Vercel deberá detectar el push y crear el preview automáticamente."
else
  yellow "No hay cambios que commitear → nada que pushear."
  info "Si esperabas un preview, revisa que tus modificaciones estén guardadas."
fi

# 6) Resumen
echo
ok "Resumen:"
git --no-pager log -1 --stat --decorate || true
