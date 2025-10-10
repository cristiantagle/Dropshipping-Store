#!/usr/bin/env bash
set -euo pipefail
echo "📦 Snapshots disponibles:"
ls .backup_global
read -p "🕰️ Ingresa el timestamp a restaurar: " TS
SRC=".backup_global/$TS"
if [ ! -d "$SRC" ]; then
  echo "❌ No existe ese respaldo: $SRC"
  exit 1
fi
echo "♻️ Restaurando desde $SRC..."
rsync -av --delete "$SRC/" ./
echo "✅ Restauración completa."
