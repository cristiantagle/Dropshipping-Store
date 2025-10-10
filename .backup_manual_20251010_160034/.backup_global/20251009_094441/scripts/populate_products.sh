#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

echo "🌙 Lunaria CJdropshipping — populate_products.sh"

# Variables por defecto
LIMIT=${1:-150}   # cantidad de productos a importar (por defecto 150)
SKIP_EXISTING=${2:-true} # omitir existentes (true/false)

echo "⚙️ Configuración:"
echo "- Límite de productos: $LIMIT"
echo "- Omitir existentes: $SKIP_EXISTING"

# 1. Verificar .env
echo "🔍 Verificando claves .env..."
missing=0
for key in NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY CJ_ACCESS_TOKEN; do
  if grep -q "$key=" "$ENV_FILE"; then
    echo "✅ $key encontrado"
  else
    echo "❌ Falta $key en .env"
    missing=1
  fi
done
if [ $missing -eq 1 ]; then
  echo "🚫 Faltan claves en .env. Aborta."
  exit 1
fi

# 2. Diagnóstico
echo "🧪 Ejecutando diagnóstico CJ..."
npx ts-node cj_import/cj_test.ts

# 3. Importación con parámetros
echo "📥 Ejecutando importación CJdropshipping..."
LIMIT=$LIMIT SKIP_EXISTING=$SKIP_EXISTING npx ts-node cj_import/cj_insert.ts

# 4. Traducción automática con Ollama
echo "🌐 Ejecutando traducción automática con Ollama..."
if [ -f "$PROJECT_ROOT/cj_import/translate.py" ]; then
  python cj_import/translate.py
else
  echo "⚠️ No se encontró translate.py, omitiendo traducción."
fi

# 5. Reporte
echo "📊 Generando reporte de importación..."
npx ts-node cj_import/cj_report.ts

# 6. Dashboard
if [ -f "$PROJECT_ROOT/cj_import/cj_dashboard.ts" ]; then
  echo "📋 Ejecutando dashboard resumido..."
  npx ts-node cj_import/cj_dashboard.ts
else
  echo "⚠️ No se encontró cj_dashboard.ts (opcional)."
fi

# 7. Limpieza opcional
echo ""
read -p "¿Deseas limpiar todo (productos, auditoría, errores)? [s/N]: " confirm
if [[ "$confirm" == "s" || "$confirm" == "S" ]]; then
  echo "🧹 Ejecutando limpieza..."
  npx ts-node cj_import/cj_cleanup.ts
else
  echo "🛑 Limpieza cancelada."
fi

echo "🎉 Pipeline populate_products.sh completado."
