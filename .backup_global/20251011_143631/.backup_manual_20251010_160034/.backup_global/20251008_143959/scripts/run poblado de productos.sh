#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

echo "🌙 Lunaria CJdropshipping — Pipeline completo"

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

# 2. Ejecutar diagnóstico
echo "🧪 Ejecutando diagnóstico CJ..."
npx ts-node cj_import/cj_test.ts

# 3. Ejecutar importación
echo "📥 Ejecutando importación CJdropshipping..."
npx ts-node cj_import/cj_insert.ts

# 4. Generar reporte
echo "📊 Generando reporte de importación..."
npx ts-node cj_import/cj_report.ts

# 5. Ejecutar dashboard
if [ -f "$PROJECT_ROOT/cj_import/cj_dashboard.ts" ]; then
  echo "📋 Ejecutando dashboard resumido..."
  npx ts-node cj_import/cj_dashboard.ts
else
  echo "⚠️ No se encontró cj_dashboard.ts (opcional)."
fi

# 6. Limpieza opcional
echo ""
read -p "¿Deseas limpiar todo (productos, auditoría, errores)? [s/N]: " confirm
if [[ "$confirm" == "s" || "$confirm" == "S" ]]; then
  echo "🧹 Ejecutando limpieza..."
  npx ts-node cj_import/cj_cleanup.ts
else
  echo "🛑 Limpieza cancelada."
fi

echo "🎉 Pipeline CJdropshipping completado."