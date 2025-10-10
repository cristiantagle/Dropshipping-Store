#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR=".backup_global/$TIMESTAMP"

echo "📦 Creando snapshot en $BACKUP_DIR ..."
mkdir -p "$BACKUP_DIR"

# Copia recursiva de todo excepto carpetas/patrones excluidos
for item in .* *; do
  case "$item" in
    .|..|.backup_global|node_modules|.next|.git|dump_autofix.txt) 
      continue 
      ;;
    *) 
      cp -r "$item" "$BACKUP_DIR/" 2>/dev/null || true
      ;;
  esac
done

echo "✅ Snapshot creado."

# Rotación: mantener últimos 3
ls -1tr .backup_global | head -n -3 | xargs -d '\n' -r rm -rf -- 2>/dev/null || true
echo "♻️ Rotación completada (últimos 3 snapshots)."
