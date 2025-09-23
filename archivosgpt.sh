#!/usr/bin/env bash
set -euo pipefail

OUT="gpt_bundle.txt"
echo "=== GPT BUNDLE | $(date) ===" > "$OUT"
echo "Repo: $(basename "$(git rev-parse --show-toplevel 2>/dev/null || echo .)")" >> "$OUT"
echo >> "$OUT"

dump_file() {
  local f="$1"
  if [[ -f "$f" ]]; then
    echo "===== BEGIN $f =====" >> "$OUT"
    cat "$f" >> "$OUT"
    echo >> "$OUT"
    echo "===== END $f =====" >> "$OUT"
    echo >> "$OUT"
  else
    echo "/* MISSING */ $f" >> "$OUT"
    echo >> "$OUT"
  fi
}

# Core que solemos revisar
dump_file "app/page.tsx"
dump_file "app/globals.css"

# Extras comunes
dump_file "components/ProductCard.tsx"
dump_file "components/ProductListClient.tsx"
dump_file "components/SectionHeader.tsx"
dump_file "components/ProductSkeleton.tsx"
dump_file "components/Hero.tsx"
dump_file "components/PreviewDebug.tsx"  # si existe

echo "=== SUMMARY ===" >> "$OUT"
echo "Todos los archivos listados fueron volcados en este bundle." >> "$OUT"
echo "Si ves /* MISSING */ arriba, ese archivo no existe actualmente." >> "$OUT"
echo "✅ Bundle generado en $OUT"
