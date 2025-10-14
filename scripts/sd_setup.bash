#!/bin/bash

# 🔧 CONFIGURACIÓN INICIAL PARA STABLE DIFFUSION AUTOMATION
# Ejecutar una sola vez para configurar todo

set -euo pipefail

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] 🔄 ${NC}$1"
}

print_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ ${NC}$1"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ ${NC}$1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️ ${NC}$1"
}

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   SD AUTOMATION SETUP                       ║"
echo "║              Configuración inicial del sistema              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

PROJECT_ROOT="/c/Users/Cristian Tagle/Desktop/Lunaria-Web/Dropshipping-Store"
SD_PATH="/c/AI/stable-diffusion/stable-diffusion-webui"

# 1. Verificar dependencias
print_step "Verificando dependencias necesarias"

if ! command -v python &> /dev/null; then
    print_error "Python no está en PATH"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    print_error "curl no está disponible"
    exit 1
fi

# Instalar jq si no existe
if ! command -v jq &> /dev/null; then
    print_warning "Instalando jq para procesamiento JSON..."
    winget install jqlang.jq &> /dev/null || print_warning "No se pudo instalar jq automáticamente"
fi

# 2. Crear directorios necesarios
print_step "Creando directorios necesarios"

mkdir -p "${PROJECT_ROOT}/public/ai-generated"
mkdir -p "${PROJECT_ROOT}/logs"
mkdir -p "${PROJECT_ROOT}/temp_sd_processing"

print_success "Directorios creados"

# 3. Verificar variables de entorno
print_step "Verificando configuración de base de datos"

cd "$PROJECT_ROOT"

if [[ -f ".env" ]]; then
    export $(grep -v '^#' ".env" | xargs)
fi

if [[ -f ".env.local" ]]; then
    export $(grep -v '^#' ".env.local" | xargs)
fi

if [[ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" ]]; then
    print_error "NEXT_PUBLIC_SUPABASE_URL no está configurada en .env"
    exit 1
fi

if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
    print_error "SUPABASE_SERVICE_ROLE_KEY no está configurada en .env"
    exit 1
fi

print_success "Variables de entorno correctas"

# 4. Instalar dependencias Python
print_step "Instalando dependencias Python necesarias"

pip install supabase requests pillow &> /dev/null || print_warning "Algunos paquetes pueden ya estar instalados"

print_success "Dependencias Python instaladas"

# 5. Verificar Stable Diffusion
print_step "Verificando instalación de Stable Diffusion WebUI"

if [[ ! -d "$SD_PATH" ]]; then
    print_error "Stable Diffusion WebUI no encontrado en: $SD_PATH"
    print_warning "Necesitas instalarlo primero. ¿Quieres que abra la documentación? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        start "https://github.com/AUTOMATIC1111/stable-diffusion-webui"
    fi
    exit 1
fi

# Verificar archivos de configuración
if [[ ! -f "$SD_PATH/webui-user.bat" ]]; then
    print_error "webui-user.bat no encontrado"
    exit 1
fi

# Verificar que tenga --api en la configuración
if ! grep -q "\-\-api" "$SD_PATH/webui-user.bat"; then
    print_warning "webui-user.bat no tiene --api habilitado"
    print_warning "Necesitas agregar --api a COMMANDLINE_ARGS en webui-user.bat"
fi

print_success "Stable Diffusion WebUI encontrado"

# 6. Crear script de prueba rápida
print_step "Creando script de prueba rápida"

cat > "${PROJECT_ROOT}/scripts/sd_quick_test.bash" << 'EOF'
#!/bin/bash

# Prueba rápida del sistema SD
SD_API_URL="http://127.0.0.1:7860"

echo "🧪 Probando conexión con Stable Diffusion WebUI..."

if curl -s -f "$SD_API_URL/sdapi/v1/options" &> /dev/null; then
    echo "✅ SD WebUI está corriendo correctamente"
    
    # Obtener información del modelo activo
    model_info=$(curl -s "$SD_API_URL/sdapi/v1/options" | jq -r '.sd_model_checkpoint // "No disponible"')
    echo "🎨 Modelo activo: $model_info"
    
    echo ""
    echo "🚀 Sistema listo para usar!"
    echo "Ejecuta: bash scripts/sd_automation_master.bash --limit 3"
    
else
    echo "❌ SD WebUI no está corriendo"
    echo "Inicia primero: C:/AI/stable-diffusion/stable-diffusion-webui/webui-user.bat"
fi
EOF

chmod +x "${PROJECT_ROOT}/scripts/sd_quick_test.bash"

print_success "Script de prueba creado"

# 7. Hacer ejecutables los scripts principales
chmod +x "${PROJECT_ROOT}/scripts/sd_automation_master.bash"
chmod +x "${PROJECT_ROOT}/scripts/sd_setup.bash"

print_success "Scripts configurados como ejecutables"

# Resumen final
echo ""
echo -e "${GREEN}🎉 CONFIGURACIÓN COMPLETADA${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo "1. Inicia Stable Diffusion WebUI:"
echo "   ${SD_PATH}/webui-user.bat"
echo ""
echo "2. Prueba la conexión:"
echo "   bash scripts/sd_quick_test.bash"
echo ""
echo "3. Ejecuta la automatización:"
echo "   bash scripts/sd_automation_master.bash --limit 5"
echo ""
echo -e "${YELLOW}Recuerda: SD WebUI debe estar corriendo ANTES de ejecutar la automatización${NC}"