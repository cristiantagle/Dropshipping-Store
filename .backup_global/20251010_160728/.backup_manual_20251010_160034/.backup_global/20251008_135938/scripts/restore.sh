#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR=".backup_run"
if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ No existe $BACKUP_DIR"
  exit 1
fi
FILES=("$@")
if [ ${#FILES[@]} -eq 0 ]; then
  echo "♻️ Restaurando todo desde $BACKUP_DIR..."
  rsync -av "$BACKUP_DIR/" ./
else
  for f in "${FILES[@]}"; do
    if [ -f "$BACKUP_DIR/$f" ]; then
      mkdir -p "$(dirname "$f")"
      cp "$BACKUP_DIR/$f" "$f"
      echo "✅ Restaurado: $f"
    else
      echo "⚠️ No existe en backup: $f"
    fi
  done
fi
