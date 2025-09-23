#!/usr/bin/env bash
set -euo pipefail
OUT="gpt_bundle.txt"
FILES=(
  "app/page.tsx"
  "components/ProductCard.tsx"
  "components/PreviewDebug.tsx"
  "lib/supabaseServer.ts"
  "app/globals.css"
)
echo "=== GPT BUNDLE $(date -Iseconds) ===" > "$OUT"
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    echo -e "\n===== BEGIN $f =====" >> "$OUT"
    cat "$f" >> "$OUT"
    echo -e "\n===== END $f =====" >> "$OUT"
  else
    echo -e "\n/* MISSING: $f */" >> "$OUT"
  fi
done
echo "Escrito $OUT"
