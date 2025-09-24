#!/usr/bin/env bash
set -euo pipefail

OUT="gpt_bundle.txt"
MANIFEST=".gpt-files"

echo "🌿 Generando ${OUT}…"
rm -f "${OUT}"

detect_lang() {
  case "${1##*.}" in
    ts|tsx) echo "ts" ;;
    js|jsx|cjs|mjs) echo "js" ;;
    json) echo "json" ;;
    css) echo "css" ;;
    md) echo "md" ;;
    sh) echo "bash" ;;
    html) echo "html" ;;
    yml|yaml) echo "yaml" ;;
    *) echo "" ;;
  esac
}

collect_file() {
  local f="$1"
  if [[ ! -f "$f" ]]; then
    echo "⚠️ Omitido (no existe): $f"
    return
  fi
  local lang
  lang="$(detect_lang "$f")"
  {
    echo "=== FILE: $f ==="
    [[ -n "$lang" ]] && echo "\`\`\`$lang" || echo "\`\`\`"
    cat "$f"
    echo
    echo "\`\`\`"
    echo
  } >> "$OUT"
}

FILES=()
if [[ -f "$MANIFEST" ]]; then
  echo "📄 Usando manifest: $MANIFEST"
  mapfile -t FILES < <(grep -vE '^\s*#' "$MANIFEST" | grep -vE '^\s*$')
else
  echo "📦 Manifest no encontrado. Usando lista por defecto."
  FILES+=($(find app components hooks lib -type f 2>/dev/null || true))
  FILES+=("package.json" "tsconfig.json" "vercel.json" ".env.example")
fi

{
  echo "# gpt_bundle.txt — Lunaria"
  echo "# Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "# Total de rutas: ${#FILES[@]}"
  echo
} >> "$OUT"

for f in "${FILES[@]}"; do
  collect_file "$f"
done

echo "✅ Bundle generado: ${OUT}"
