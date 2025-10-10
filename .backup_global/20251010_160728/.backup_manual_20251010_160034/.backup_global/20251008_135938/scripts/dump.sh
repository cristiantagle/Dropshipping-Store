#!/usr/bin/env bash
set -euo pipefail
OUT="dump_autofix.txt"
> "$OUT"
DEFAULT_FILES=("app/page.tsx" "app/categorias/[slug]/page.tsx" "components/ProductCard.tsx" "lib/format.ts")
FILES=("$@")
if [ ${#FILES[@]} -eq 0 ]; then FILES=("${DEFAULT_FILES[@]}"); fi
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    echo -e "\n=== FILE: $f ===" >> "$OUT"
    echo '```' >> "$OUT"
    cat "$f" >> "$OUT"
    echo '```' >> "$OUT"
    echo "✅ Dumped: $f"
  else
    echo "⚠️ Archivo no encontrado: $f"
  fi
done
