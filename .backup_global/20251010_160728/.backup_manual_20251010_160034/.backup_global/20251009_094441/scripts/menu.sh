#!/usr/bin/env bash
set -euo pipefail
while true; do
  echo "=== Menú de utilidades ==="
  echo "1) Dump de archivos"
  echo "2) Aplicar patch"
  echo "3) Rollback"
  echo "4) Build estricto"
  echo "5) Flujo completo (run.sh)"
  echo "6) Limpieza (clean.sh)"
  echo "7) Limpieza profunda (clean.sh --deep)"
  echo "8) Lint & Fix"
  echo "9) Type Check (tsc)"
  echo "10) Test (npm test)"
  echo "11) Auditoría de dependencias (npm audit)"
  echo "12) Ver dependencias desactualizadas (npm outdated)"
  echo "13) Reset Hard (limpieza + npm ci)"
  echo "14) Restaurar respaldo global (restore_global.sh)"
  echo "15) Ver archivos respaldados (.backup_run)"
  echo "16) Limpiar snapshots viejos (snapshot_cleaner.sh)"
  echo "0) Salir"
  read -p "Elige opción: " opt
  case $opt in
    1) bash scripts/dump.sh ;;
    2) bash scripts/patch.sh ;;
    3) bash scripts/rollback.sh ;;
    4) bash scripts/strict-build.sh ;;
    5) bash scripts/run.sh ;;
    6) bash scripts/clean.sh ;;
    7) bash scripts/clean.sh --deep ;;
    8) npm run lint -- --fix || true ;;
    9) npx tsc --noEmit || true ;;
    10) npm test || true ;;
    11) npm audit || true ;;
    12) npm outdated || true ;;
    13) bash scripts/clean.sh --deep && npm ci ;;
    14) bash scripts/restore_global.sh ;;
    15) ls -R .backup_run ;;
    16) bash scripts/snapshot_cleaner.sh ;;
    0) echo "👋 Saliendo..."; exit 0 ;;
    *) echo "Opción inválida" ;;
  esac
  echo ""
done
