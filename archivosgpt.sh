#!/usr/bin/env sh
# archivosgpt.sh — Volcado completo del repo a un "GPT BUNDLE" (POSIX sh)
# Uso:
#   sh archivosgpt.sh
#   OUT=mi_bundle.txt sh archivosgpt.sh
#   INCLUDE_UNTRACKED=1 sh archivosgpt.sh
#   MAX_SIZE=300000 sh archivosgpt.sh
set -eu

OUT="${OUT:-gpt_bundle.txt}"
MAX_SIZE="${MAX_SIZE:-200000}"         # 200 KB por archivo de texto
INCLUDE_UNTRACKED="${INCLUDE_UNTRACKED:-0}"
EXTRA_EXCLUDES="${EXTRA_EXCLUDES:-}"   # patrones extra (prefijo path), separados por espacio

# ===== Repo root / nombre
if command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1; then
  REPO_ROOT="$(git rev-parse --show-toplevel)"
  REPO_NAME="$(basename "$REPO_ROOT")"
  cd "$REPO_ROOT"
else
  REPO_ROOT="$PWD"
  REPO_NAME="$(basename "$REPO_ROOT")"
fi

# ===== Archivo temporal para evitar autolectura
TMP_OUT="$(mktemp "${TMPDIR:-/tmp}/gpt_bundle.XXXXXX")"
trap 'rm -f "$TMP_OUT" "$FILELIST_TMP" 2>/dev/null || true' EXIT

# ===== Helpers (POSIX)
filesize() {
  # Linux stat
  if stat -c%s "$1" >/dev/null 2>&1; then
    stat -c%s "$1"
    return 0
  fi
  # macOS/BSD stat
  if stat -f%z "$1" >/dev/null 2>&1; then
    stat -f%z "$1"
    return 0
  fi
  # Fallback burdo
  wc -c <"$1" | tr -d ' '
}

is_text() {
  f="$1"
  [ -f "$f" ] || return 1
  if command -v file >/dev/null 2>&1; then
    if file -I "$f" 2>/dev/null | grep -Eiq 'text/|application/json|application/javascript'; then
      return 0
    fi
    if file --mime "$f" 2>/dev/null | grep -Eiq 'text/|application/json|application/javascript'; then
      return 0
    fi
  fi
  # fallback: grep “parece texto”
  grep -Iq . "$f" 2>/dev/null
}

should_exclude() {
  f="$1"

  # normaliza ./ prefijo
  case "$f" in
    ./*) f="${f#./}" ;;
  esac

  # No incluir el propio bundle ni bundles previos
  [ "$f" = "$OUT" ] && return 0
  case "$f" in
    gpt_bundle.txt|gpt_bundle.*.txt|gpt_bundle*.txt) return 0 ;;
  esac

  # No incluir este script
  case "$f" in
    archivosgpt.sh) return 0 ;;
  esac

  # Carpetas pesadas / outputs
  case "$f" in
    .git/*|.git|node_modules/*|node_modules|.next/*|.next|.turbo/*|.turbo|.vercel/*|.vercel|dist/*|dist|build/*|build|out/*|out|coverage/*|coverage)
      return 0 ;;
  esac

  # Binarios conocidos
  case "$f" in
    *.png|*.jpg|*.jpeg|*.gif|*.webp|*.svgz|*.ico|*.pdf|*.zip|*.gz|*.tgz|*.rar|*.7z|*.mp4|*.mp3|*.wav|*.mov|*.avi|*.woff|*.woff2|*.ttf|*.otf|*.eot)
      return 0 ;;
  esac

  # Excludes extra por prefijo
  for pat in $EXTRA_EXCLUDES; do
    case "$f" in
      "$pat"/*|"$pat") return 0 ;;
    esac
  done

  return 1
}

# ===== Construir lista de archivos (sin arrays)
FILELIST_TMP="$(mktemp "${TMPDIR:-/tmp}/gpt_files.XXXXXX")"

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  # tracked
  git ls-files >"$FILELIST_TMP"
  # + untracked (respetando .gitignore) si se pide
  if [ "$INCLUDE_UNTRACKED" = "1" ]; then
    git ls-files -o --exclude-standard >>"$FILELIST_TMP"
  fi
else
  # sin git: listar con find
  find . -type f \
    ! -path "*/.git/*" \
    ! -path "*/node_modules/*" \
    ! -path "*/.next/*" \
    ! -path "*/.turbo/*" \
    ! -path "*/.vercel/*" \
    ! -path "*/dist/*" \
    ! -path "*/build/*" \
    ! -path "*/out/*" \
    ! -path "*/coverage/*" \
    | sed 's|^\./||' >"$FILELIST_TMP"
fi

# Orden y únicos
sort -u "$FILELIST_TMP" -o "$FILELIST_TMP"

# ===== Header
{
  echo "=== GPT BUNDLE | $(date) ==="
  echo "Repo: $REPO_NAME"
  echo
} >"$TMP_OUT"

# ===== Volcado
count_text=0
count_bin=0
count_skip=0

# Usamos while + IFS para manejar espacios en nombres de archivo
# shellcheck disable=SC2039
while IFS= read -r f; do
  [ -n "$f" ] || continue

  # Normaliza ./ prefijo
  case "$f" in
    ./*) f="${f#./}" ;;
  esac

  # Excluir segun reglas
  if should_exclude "$f"; then
    count_skip=$((count_skip + 1))
    continue
  fi

  if [ ! -f "$f" ]; then
    {
      echo "/* MISSING */ $f"
      echo
    } >>"$TMP_OUT"
    continue
  fi

  sz="$(filesize "$f" 2>/dev/null || echo 0)"

  if is_text "$f"; then
    if [ "$sz" -le "$MAX_SIZE" ]; then
      {
        echo "===== BEGIN $f ====="
        cat "$f"
        echo
        echo "===== END $f ====="
        echo
      } >>"$TMP_OUT"
      count_text=$((count_text + 1))
    else
      {
        echo "/* SKIPPED (too large: ${sz} bytes, limit ${MAX_SIZE}) */ $f"
        echo
      } >>"$TMP_OUT"
      count_skip=$((count_skip + 1))
    fi
  else
    {
      echo "/* BINARY (not dumped) */ $f (${sz} bytes)"
      echo
    } >>"$TMP_OUT"
    count_bin=$((count_bin + 1))
  fi
done <"$FILELIST_TMP"

# ===== Summary
{
  echo "=== SUMMARY ==="
  echo "Archivos de texto volcados: ${count_text}"
  echo "Archivos binarios (no volcados): ${count_bin}"
  echo "Saltados (excluidos / grandes): ${count_skip}"
  echo "Raíz del repo: ${REPO_ROOT}"
} >>"$TMP_OUT"

# ===== Movimiento atómico
mv -f "$TMP_OUT" "$OUT"
trap - EXIT

echo "✅ Bundle generado en $OUT"
