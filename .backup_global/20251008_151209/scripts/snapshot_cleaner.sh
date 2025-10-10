#!/usr/bin/env bash
set -euo pipefail
MAX_BACKUPS=${1:-3}
cd .backup_global || exit 0
ls -1tr | head -n -$MAX_BACKUPS | xargs -d '\n' rm -rf -- || true
cd ..
echo "🧹 Snapshots reducidos a los últimos $MAX_BACKUPS."
