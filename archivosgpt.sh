#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

echo "=== GPT BUNDLE | $(date) ==="
echo "Repo: $(basename "$ROOT")"
echo

print_file () {
  local f="$1"
  if [ -f "$f" ]; then
    echo
    echo "===== BEGIN $f ====="
    cat "$f"
    echo
    echo "===== END $f ====="
    echo
  else
    echo
    echo "===== BEGIN $f (NO EXISTE) ====="
    echo "(archivo no encontrado)"
    echo "===== END $f (NO EXISTE) ====="
    echo
  fi
}

# Archivos núcleo
print_file "app/page.tsx"
print_file "lib/supabaseServer.ts"

# Componentes relevantes del Home/Topbar
print_file "components/SearchBar.tsx"
print_file "components/SectionHeader.tsx"
print_file "components/ProductSkeleton.tsx"
print_file "components/TopBar.tsx"
