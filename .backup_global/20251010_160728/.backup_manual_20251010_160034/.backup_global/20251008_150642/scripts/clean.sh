#!/usr/bin/env bash
set -euo pipefail
echo "🧹 Limpiando archivos temporales, backups y caches..."

rm -rf .backup_run
rm -f dump*.txt dump_autofix.txt

find . -type f \( -name "*.bak" -o -name "*.old" -o -name "*.orig" -o -name "*~" -o -name ".*.swp" \) -print -delete

rm -f npm-debug.log* yarn-error.log*
rm -rf .next/cache .turbo
rm -rf .next out

if [[ "${1:-}" == "--deep" ]]; then
  echo "⚠️  Limpieza profunda: borrando node_modules..."
  rm -rf node_modules
fi

echo "✅ Limpieza completada."
