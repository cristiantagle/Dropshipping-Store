# run_finish.sh
#!/usr/bin/env bash
set -Eeuo pipefail

REMOTE="${REPO_REMOTE:-origin}"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
if [[ -z "${branch}" || "${branch}" == "HEAD" ]]; then
  echo "❌ No estoy en una rama con nombre. Haz: git checkout -b preview/xxxx"
  exit 1
fi

echo "🔎 Rama actual: ${branch}"

echo "📝 Commit (si hay cambios)…"
git add -A
git commit -m "chore: finalizar fix cats & badge (autocommit)" || echo "ℹ️ Nada que commitear"

echo "🚀 Push a ${REMOTE}/${branch}…"
git push -u "${REMOTE}" "${branch}"

owner_repo="$(git remote get-url ${REMOTE} | sed -E 's#(git@|https://)github.com[:/]{1}([^/]+/[^/.]+).*#\2#')"
echo "🔗 PR: https://github.com/${owner_repo}/pull/new/${branch}"
echo "✅ Vercel debería crear el preview automáticamente al recibir la rama."
