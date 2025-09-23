#!/usr/bin/env bash
set -euo pipefail
OUT="gpt_bundle.txt"
echo "=== GPT BUNDLE | $(date) ===" > "$OUT"
echo "Repo: $(basename "$(git rev-parse --show-toplevel 2>/dev/null || echo .)")" >> "$OUT"
echo >> "$OUT"
dump() { local f="$1"; if [[ -f "$f" ]]; then
  echo "===== BEGIN $f =====" >> "$OUT"; cat "$f" >> "$OUT"; echo >> "$OUT"; echo "===== END $f =====" >> "$OUT"; echo >> "$OUT";
else echo "/* MISSING */ $f" >> "$OUT"; echo >> "$OUT"; fi }
dump "app/page.tsx"; dump "app/globals.css"
dump "components/ProductCard.tsx"; dump "components/ProductListClient.tsx"; dump "components/SectionHeader.tsx"; dump "components/ProductSkeleton.tsx"; dump "components/Hero.tsx"; dump "components/PreviewDebug.tsx"
dump "app/producto/[id]/page.tsx"; dump "app/producto/[id]/loading.tsx"
echo "=== SUMMARY ===" >> "$OUT"; echo "Todos los archivos listados fueron volcados en este bundle." >> "$OUT"; echo "Si ves /* MISSING */ arriba, ese archivo no existe actualmente." >> "$OUT"
echo "✅ Bundle generado en $OUT"
