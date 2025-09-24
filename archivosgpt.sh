#!/usr/bin/env bash
set -euo pipefail

# archivosgpt.sh — divide el bundle en partes de 20 archivos sin cortar ninguno

MAX_FILES=20

echo "🧩 Generando bundle dividido en partes de hasta $MAX_FILES archivos cada una..."

# Verificar que estamos en la raíz del repo git
if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "❌ No estás en un repositorio git. Ejecuta este script en la raíz del repo."
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Patrones de exclusión
EXCLUDE_DIRS='(^|/)(node_modules|\.next|dist|build|coverage|\.git|\.vercel|\.cache)(/|$)'
EXCLUDE_FILES='(\.DS_Store$|\.env$|\.env\..*$)'
EXCLUDE_EXT='\.(png|jpg|jpeg|svg|webp|gif|ico|pdf|zip|tar|gz|rar|7z|mp4|mov|avi|mp3|wav|woff|woff2|ttf|eot|bin)$'
INCLUDE_EXT='\.((j|t)sx?|mjs|cjs|json|md|txt|css|scss|ya?ml|html|conf|config|lock)$'

# Archivos versionados y no ignorados
TRACKED="$(git ls-files)"
UNTRACKED="$(git ls-files --others --exclude-standard)"
ALL_FILES="$(printf "%s\n%s\n" "$TRACKED" "$UNTRACKED" | sort -u)"

# Filtrar archivos válidos
FILTERED="$(echo "$ALL_FILES" \
  | grep -Ev "$EXCLUDE_DIRS" \
  | grep -Ev "$EXCLUDE_FILES" \
  | grep -Ev "$EXCLUDE_EXT" \
  | grep -E "$INCLUDE_EXT" || true)"

# Dividir en bloques
COUNT=0
PART=1
BATCH=()

write_part() {
  local OUT="gpt_bundle_part_${PART}.txt"
  echo "# GPT bundle - Parte $PART" > "$OUT"
  echo "# Archivos incluidos: ${#BATCH[@]}" >> "$OUT"
  echo "# Generado: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUT"
  echo "" >> "$OUT"

  for FILE in "${BATCH[@]}"; do
    echo "=== FILE: $FILE ===" >> "$OUT"
    echo '```' >> "$OUT"
    cat "$FILE" >> "$OUT"
    echo '' >> "$OUT"
    echo '```' >> "$OUT"
    echo "" >> "$OUT"
  done

  echo "✅ Parte $PART generada: $OUT"
  PART=$((PART + 1))
  BATCH=()
}

while IFS= read -r FILE; do
  if [ -f "$FILE" ]; then
    BATCH+=("$FILE")
    COUNT=$((COUNT + 1))
    if [ "${#BATCH[@]}" -ge "$MAX_FILES" ]; then
      write_part
    fi
  fi
done <<< "$FILTERED"

# Último bloque
if [ "${#BATCH[@]}" -gt 0 ]; then
  write_part
fi

echo "📦 Total de archivos procesados: $COUNT"
echo "📚 Total de partes generadas: $((PART - 1))"
