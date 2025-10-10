#!/usr/bin/env bash

SOURCE="/c/Users/crist/OneDrive/Escritorio/Lunaria-Web/Dropshipping-Store"
TARGET="/c/Users/crist/OneDrive/Escritorio/RepoCopi"

INCLUDE_DIRS=("app" "cj_import" "components" "hooks" "lib" "scripts" "styles")
INCLUDE_FILES=("menu.sh" "middleware.ts" "next.config.js" "postcss.config.js" \
"tailwind.config.ts" "tailwind.config.ts.bak.20251004-153416" \
"tsconfig.json" "tsconfig.audit.json" "run.ps1" "run.sh" "package.json")
EXCLUDE_DIRS=("node_modules" ".git" ".next" ".vercel" "dist" "build" "coverage")

mkdir -p "$TARGET"

echo "⏳ Iniciando extracción de archivos hacia RepoCopi..."
echo "Esto puede tardar unos minutos, por favor espera..."

{
  for dir in "${INCLUDE_DIRS[@]}"; do
    find "$SOURCE/$dir" -type d \( $(printf -- '-name %s -o ' "${EXCLUDE_DIRS[@]}" | sed 's/ -o $//') \) -prune -o -type f -print | while read -r file; do
      rel="${file#$SOURCE/}"
      safe_rel=$(echo "$rel" | sed 's/\[/_/g; s/\]/_/g')
      dest="$TARGET/$safe_rel.txt"
      mkdir -p "$(dirname "$dest")"
      iconv -f utf-8 -t utf-8 "$file" -o "$dest" 2>/dev/null || cp "$file" "$dest" > /dev/null 2>&1
    done
  done

  for f in "${INCLUDE_FILES[@]}"; do
    if [ -f "$SOURCE/$f" ]; then
      cp "$SOURCE/$f" "$TARGET/$f.txt" > /dev/null 2>&1
    fi
  done
} > /dev/null 2>&1   # 🔇 silencia todo el proceso interno

echo "✅ RepoCopi actualizado correctamente el $(date '+%Y-%m-%d %H:%M:%S')"