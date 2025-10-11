#!/usr/bin/env bash
set -euo pipefail

# run.sh — divide el repo en partes de hasta ~80 KB
# y corta archivos individuales grandes en bloques de 500 líneas

MAX_SIZE=80000   # bytes (~80 KB)
MAX_LINES=500    # líneas por bloque dentro de un archivo grande

echo "🧩 Generando bundle dividido en partes de hasta $MAX_SIZE bytes..."

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

PART=1
CUR_SIZE=0
OUT="gpt_bundle_part_${PART}.txt"
echo "# GPT bundle - Parte $PART" > "$OUT"
echo "# Generado: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUT"
echo "" >> "$OUT"

flush_part() {
  echo "✅ Parte $PART generada: $OUT"
  PART=$((PART + 1))
  OUT="gpt_bundle_part_${PART}.txt"
  CUR_SIZE=0
  echo "# GPT bundle - Parte $PART" > "$OUT"
  echo "# Generado: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUT"
  echo "" >> "$OUT"
}

for FILE in $FILTERED; do
  if [ -f "$FILE" ]; then
    PARTS=()
    # Si el archivo tiene más de MAX_LINES, lo partimos
    if [ "$(wc -l < "$FILE")" -gt $MAX_LINES ]; then
      split -l $MAX_LINES --numeric-suffixes=1 --additional-suffix=.tmp "$FILE" "${FILE}.part"
      PARTS=(${FILE}.part*.tmp)
    else
      PARTS=("$FILE")
    fi

    for P in "${PARTS[@]}"; do
      CONTENT=$(cat "$P")
      BLOCK="=== FILE: $FILE ==="$'\n''```'$'\n'"$CONTENT"$'\n''```'$'\n\n'
      BLOCK_SIZE=$(printf "%s" "$BLOCK" | wc -c)

      if [ $((CUR_SIZE + BLOCK_SIZE)) -gt $MAX_SIZE ]; then
        flush_part
      fi

      printf "%s" "$BLOCK" >> "$OUT"
      CUR_SIZE=$((CUR_SIZE + BLOCK_SIZE))

      # limpiar temporales
      [[ "$P" == *.tmp ]] && rm -f "$P"
    done
  fi
done

echo "✅ Parte $PART generada: $OUT"
echo "📚 Total de partes generadas: $PART"