#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR=".backup_run"
FILES=("app/page.tsx" "app/categorias/[slug]/page.tsx" "components/ProductCard.tsx" "lib/format.ts")
echo "♻️ Restaurando archivos desde $BACKUP_DIR..."
for f in "${FILES[@]}"; do
  if [ -f "$BACKUP_DIR/$(basename $f)" ]; then
    cp "$BACKUP_DIR/$(basename $f)" "$f"
    echo "Restaurado: $f"
  fi
done
