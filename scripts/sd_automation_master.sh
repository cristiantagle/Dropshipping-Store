#!/bin/bash

# 🚀 SCRIPT MAESTRO DE AUTOMATIZACIÓN STABLE DIFFUSION + BASE DE DATOS
# Autor: Warp AI Assistant
# Fecha: 12 Octubre 2025
# Propósito: Integración completa SD WebUI con sistema Lunaria Dropshipping

set -euo pipefail  # Salir en cualquier error

# ===============================================
# 🎨 CONFIGURACIÓN Y VARIABLES GLOBALES
# ===============================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Rutas principales
PROJECT_ROOT="/c/Users/Cristian Tagle/Desktop/Lunaria-Web/Dropshipping-Store"
SD_PATH="/c/AI/stable-diffusion/stable-diffusion-webui"
IMAGES_OUTPUT_DIR="${PROJECT_ROOT}/public/ai-generated"
TEMP_DIR="${PROJECT_ROOT}/temp_sd_processing"

# URLs y configuración
SD_API_URL="http://127.0.0.1:7860"
SD_API_GENERATE="${SD_API_URL}/sdapi/v1/txt2img"
SD_API_OPTIONS="${SD_API_URL}/sdapi/v1/options"
SD_API_MODELS="${SD_API_URL}/sdapi/v1/sd-models"

# Configuración de generación
DEFAULT_WIDTH=512
DEFAULT_HEIGHT=512
DEFAULT_STEPS=25
DEFAULT_CFG_SCALE=7.5
DEFAULT_SAMPLER="DPM++ 2M Karras"
IMAGES_PER_PRODUCT=3
MAX_CONCURRENT_GENERATIONS=2

# Base de datos (Supabase)
DB_CONNECTION_STRING=""  # Se configurará dinámicamente

# ===============================================
# 🛠️ FUNCIONES DE UTILIDAD
# ===============================================

print_header() {
    echo -e "\n${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${WHITE}                    $1                    ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] 🔄 ${WHITE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ ${WHITE}$1${NC}"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ ${WHITE}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  ${WHITE}$1${NC}"
}

print_info() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] ℹ️  ${WHITE}$1${NC}"
}

# ===============================================
# 🔧 FUNCIONES DE VERIFICACIÓN Y SETUP
# ===============================================

check_dependencies() {
    print_step "Verificando dependencias del sistema"
    
    # Verificar que estamos en Git Bash
    if [[ ! "$OSTYPE" == "msys" ]] && [[ ! "$OSTYPE" == "cygwin" ]]; then
        print_warning "Este script está optimizado para Git Bash en Windows"
    fi
    
    # Verificar Python
    if ! command -v python &> /dev/null; then
        print_error "Python no está disponible en PATH"
        return 1
    fi
    
    # Verificar curl
    if ! command -v curl &> /dev/null; then
        print_error "curl no está disponible"
        return 1
    fi
    
    # Verificar jq para JSON parsing
    if ! command -v jq &> /dev/null; then
        print_warning "jq no está disponible. Instalando..."
        # En Git Bash, podemos usar winget
        winget install jqlang.jq &> /dev/null || print_warning "No se pudo instalar jq automáticamente"
    fi
    
    # Verificar ImageMagick para procesamiento de imágenes
    if ! command -v magick &> /dev/null; then
        print_warning "ImageMagick no está disponible. Recomendado para optimización de imágenes"
    fi
    
    print_success "Verificación de dependencias completada"
}

verify_stable_diffusion() {
    print_step "Verificando Stable Diffusion WebUI"
    
    # Verificar que la instalación existe
    if [[ ! -d "$SD_PATH" ]]; then
        print_error "Stable Diffusion WebUI no encontrado en: $SD_PATH"
        print_info "Ejecuta el instalador: scripts/install_stable_diffusion.bat"
        return 1
    fi
    
    # Verificar que el servidor está corriendo
    local max_attempts=3
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        print_step "Verificando conexión API (intento $attempt/$max_attempts)"
        
        if curl -s -f "$SD_API_URL/sdapi/v1/options" &> /dev/null; then
            print_success "Stable Diffusion WebUI está corriendo correctamente"
            return 0
        fi
        
        if [[ $attempt -eq 1 ]]; then
            print_warning "SD WebUI no está corriendo. Intentando iniciar..."
            start_stable_diffusion_background
            sleep 30  # Dar tiempo para que inicie
        else
            sleep 10
        fi
        
        ((attempt++))
    done
    
    print_error "No se pudo conectar con Stable Diffusion WebUI"
    print_info "Inicia manualmente: ${SD_PATH}/webui-user.bat"
    return 1
}

start_stable_diffusion_background() {
    print_step "Iniciando Stable Diffusion WebUI en segundo plano"
    
    cd "$SD_PATH"
    
    # Iniciar en nueva ventana de PowerShell para que no bloquee
    powershell.exe -Command "Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd \"$SD_PATH\"; .\webui-user.bat' -WindowStyle Normal" &
    
    print_info "SD WebUI iniciándose en ventana separada. Esperando 60 segundos..."
    sleep 60
}

setup_directories() {
    print_step "Configurando directorios necesarios"
    
    # Crear directorio de imágenes generadas
    mkdir -p "$IMAGES_OUTPUT_DIR"
    chmod 755 "$IMAGES_OUTPUT_DIR"
    
    # Crear directorio temporal
    mkdir -p "$TEMP_DIR"
    
    # Crear directorio de logs
    mkdir -p "${PROJECT_ROOT}/logs"
    
    print_success "Directorios configurados correctamente"
}

# ===============================================
# 🗄️ FUNCIONES DE BASE DE DATOS
# ===============================================

setup_database_connection() {
    print_step "Configurando conexión a base de datos"
    
    # Cargar variables de entorno
    if [[ -f "${PROJECT_ROOT}/.env" ]]; then
        export $(grep -v '^#' "${PROJECT_ROOT}/.env" | xargs)
    fi
    
    if [[ -f "${PROJECT_ROOT}/.env.local" ]]; then
        export $(grep -v '^#' "${PROJECT_ROOT}/.env.local" | xargs)
    fi
    
    # Verificar variables críticas
    if [[ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" ]] || [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
        print_error "Variables de Supabase no están configuradas"
        print_info "Asegúrate de que .env tenga NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY"
        return 1
    fi
    
    print_success "Conexión a base de datos configurada"
}

get_products_without_ai_images() {
    local limit=${1:-10}
    
    print_step "Obteniendo productos sin imágenes AI (límite: $limit)"
    
    # Crear script Python temporal para consultar Supabase
    cat > "$TEMP_DIR/get_products.py" << 'EOF'
import os
import sys
import json
from supabase import create_client

# Configuración
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
limit = int(sys.argv[1]) if len(sys.argv) > 1 else 10

if not supabase_url or not supabase_key:
    print("ERROR: Variables de Supabase no configuradas", file=sys.stderr)
    sys.exit(1)

try:
    # Crear cliente
    supabase = create_client(supabase_url, supabase_key)
    
    # Consultar productos que no tienen imágenes AI o tienen pocas
    response = supabase.table('products').select(
        'id, name, name_es, description, description_es, category_slug, image_url, images'
    ).or_(
        'images.is.null,images.eq.[]'
    ).not_(
        'name', 'is', 'null'
    ).limit(limit).execute()
    
    products = response.data
    print(json.dumps(products, indent=2))
    
except Exception as e:
    print(f"ERROR: {str(e)}", file=sys.stderr)
    sys.exit(1)
EOF
    
    # Ejecutar script Python y capturar output
    local products_json
    if products_json=$(cd "$PROJECT_ROOT" && python "$TEMP_DIR/get_products.py" "$limit" 2>/dev/null); then
        echo "$products_json" > "$TEMP_DIR/products_to_process.json"
        local count=$(echo "$products_json" | jq '. | length')
        print_success "Encontrados $count productos para procesar"
        return 0
    else
        print_error "Error al obtener productos de la base de datos"
        return 1
    fi
}

update_product_images() {
    local product_id="$1"
    local images_array="$2"
    
    print_step "Actualizando producto $product_id con nuevas imágenes"
    
    # Crear script Python temporal para actualizar
    cat > "$TEMP_DIR/update_product.py" << EOF
import os
import sys
import json
from supabase import create_client

# Configuración
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
product_id = sys.argv[1]
images_json = sys.argv[2]

try:
    # Crear cliente
    supabase = create_client(supabase_url, supabase_key)
    
    # Parsear imágenes
    images = json.loads(images_json)
    
    # Actualizar producto
    response = supabase.table('products').update({
        'images': images,
        'updated_at': 'now()'
    }).eq('id', product_id).execute()
    
    if response.data:
        print("SUCCESS")
    else:
        print("ERROR: No se pudo actualizar")
        sys.exit(1)
        
except Exception as e:
    print(f"ERROR: {str(e)}")
    sys.exit(1)
EOF
    
    # Ejecutar actualización
    if cd "$PROJECT_ROOT" && python "$TEMP_DIR/update_product.py" "$product_id" "$images_array" 2>/dev/null | grep -q "SUCCESS"; then
        print_success "Producto $product_id actualizado correctamente"
        return 0
    else
        print_error "Error al actualizar producto $product_id"
        return 1
    fi
}

# ===============================================
# 🎨 FUNCIONES DE STABLE DIFFUSION
# ===============================================

generate_product_prompts() {
    local product_name="$1"
    local category="$2"
    local style_index="$3"
    
    # Limpiar nombre del producto
    local clean_name=$(echo "$product_name" | sed 's/[^a-zA-Z0-9 ]//g' | tr '[:upper:]' '[:lower:]')
    
    # Templates de prompts por estilo
    case $style_index in
        1)
            echo "professional product photography of ${clean_name}, white background, studio lighting, commercial photo, 4k, high quality"
            ;;
        2)
            echo "side view of ${clean_name}, clean white background, product catalog style, professional lighting"
            ;;
        3)
            echo "${clean_name} on elegant surface, soft shadows, modern aesthetic, lifestyle photography"
            ;;
        *)
            echo "high quality photo of ${clean_name}, professional lighting, clean background"
            ;;
    esac
}

generate_negative_prompt() {
    echo "blurry, low quality, bad anatomy, deformed, extra limbs, missing parts, text, watermark, signature, logo, brand name, cluttered background, oversaturated, noisy, pixelated, distorted"
}

generate_single_image() {
    local prompt="$1"
    local output_path="$2"
    local width="${3:-$DEFAULT_WIDTH}"
    local height="${4:-$DEFAULT_HEIGHT}"
    
    print_step "Generando imagen: $(basename "$output_path")"
    
    # Crear payload JSON para SD API
    local payload=$(cat << EOF
{
    "prompt": "$prompt",
    "negative_prompt": "$(generate_negative_prompt)",
    "width": $width,
    "height": $height,
    "steps": $DEFAULT_STEPS,
    "cfg_scale": $DEFAULT_CFG_SCALE,
    "sampler_name": "$DEFAULT_SAMPLER",
    "batch_size": 1,
    "n_iter": 1,
    "restore_faces": false,
    "tiling": false,
    "seed": -1,
    "subseed": -1,
    "subseed_strength": 0,
    "seed_resize_from_h": -1,
    "seed_resize_from_w": -1,
    "denoising_strength": 0.75,
    "override_settings": {},
    "override_settings_restore_afterwards": true
}
EOF
    )
    
    # Hacer request a SD API
    local response
    if response=$(curl -s -X POST -H "Content-Type: application/json" -d "$payload" "$SD_API_GENERATE" --max-time 180); then
        
        # Extraer imagen base64 del response
        local image_b64=$(echo "$response" | jq -r '.images[0]' 2>/dev/null)
        
        if [[ "$image_b64" != "null" ]] && [[ -n "$image_b64" ]]; then
            # Decodificar y guardar imagen
            echo "$image_b64" | base64 -d > "$output_path"
            
            # Verificar que el archivo se creó correctamente
            if [[ -f "$output_path" ]] && [[ -s "$output_path" ]]; then
                print_success "Imagen generada: $(basename "$output_path")"
                return 0
            else
                print_error "Error al guardar imagen: $(basename "$output_path")"
                return 1
            fi
        else
            print_error "SD API no devolvió imagen válida"
            echo "Response: $response" >&2
            return 1
        fi
    else
        print_error "Error en request a SD API"
        return 1
    fi
}

optimize_image() {
    local input_path="$1"
    local output_path="$2"
    
    if command -v magick &> /dev/null; then
        # Optimizar con ImageMagick
        magick "$input_path" -quality 85 -strip -resize '512x512>' "$output_path" 2>/dev/null || {
            # Si falla, solo copiar
            cp "$input_path" "$output_path"
        }
    else
        # Sin ImageMagick, solo copiar
        cp "$input_path" "$output_path"
    fi
}

process_product_images() {
    local product_data="$1"
    
    # Extraer datos del producto
    local product_id=$(echo "$product_data" | jq -r '.id')
    local product_name=$(echo "$product_data" | jq -r '.name_es // .name')
    local category=$(echo "$product_data" | jq -r '.category_slug // "otros"')
    local original_image=$(echo "$product_data" | jq -r '.image_url // ""')
    
    print_header "PROCESANDO: $product_name"
    
    # Crear directorio para este producto
    local product_dir="$TEMP_DIR/product_${product_id}"
    mkdir -p "$product_dir"
    
    # Array para URLs de imágenes finales
    local images_urls=()
    
    # Agregar imagen original si existe
    if [[ -n "$original_image" ]] && [[ "$original_image" != "null" ]]; then
        images_urls+=("\"$original_image\"")
    fi
    
    # Generar múltiples imágenes
    for i in $(seq 1 $IMAGES_PER_PRODUCT); do
        local prompt=$(generate_product_prompts "$product_name" "$category" "$i")
        local temp_image="$product_dir/temp_${i}.png"
        local final_image="$IMAGES_OUTPUT_DIR/ai_${product_id}_${i}.png"
        local web_url="/ai-generated/ai_${product_id}_${i}.png"
        
        print_step "Generando imagen $i/$IMAGES_PER_PRODUCT"
        print_info "Prompt: $prompt"
        
        if generate_single_image "$prompt" "$temp_image"; then
            # Optimizar imagen
            optimize_image "$temp_image" "$final_image"
            
            # Agregar URL a la lista
            images_urls+=("\"$web_url\"")
            
            print_success "Imagen $i completada"
        else
            print_warning "Error generando imagen $i, continuando..."
        fi
        
        # Breve pausa entre generaciones
        sleep 2
    done
    
    # Actualizar base de datos si se generaron imágenes
    if [[ ${#images_urls[@]} -gt 0 ]]; then
        local images_json="[$(IFS=,; echo "${images_urls[*]}")]"
        
        if update_product_images "$product_id" "$images_json"; then
            print_success "Producto $product_name procesado completamente (${#images_urls[@]} imágenes)"
        else
            print_error "Error actualizando base de datos para $product_name"
        fi
    else
        print_warning "No se generaron imágenes para $product_name"
    fi
    
    # Limpiar archivos temporales
    rm -rf "$product_dir"
}

# ===============================================
# 🚀 FUNCIÓN PRINCIPAL
# ===============================================

main() {
    print_header "STABLE DIFFUSION AUTOMATION MASTER"
    
    # Parseear argumentos
    local limit=5
    local force_start_sd=false
    local skip_verification=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --limit)
                limit="$2"
                shift 2
                ;;
            --force-start-sd)
                force_start_sd=true
                shift
                ;;
            --skip-verification)
                skip_verification=true
                shift
                ;;
            --help)
                echo "Uso: $0 [OPCIONES]"
                echo ""
                echo "Opciones:"
                echo "  --limit N               Número de productos a procesar (default: 5)"
                echo "  --force-start-sd        Forzar inicio de SD WebUI"
                echo "  --skip-verification     Saltar verificaciones de dependencias"
                echo "  --help                  Mostrar esta ayuda"
                echo ""
                echo "Ejemplos:"
                echo "  $0                      # Procesar 5 productos"
                echo "  $0 --limit 20           # Procesar 20 productos"
                echo "  $0 --force-start-sd     # Forzar inicio de SD y procesar"
                exit 0
                ;;
            *)
                print_error "Opción desconocida: $1"
                exit 1
                ;;
        esac
    done
    
    print_info "Configuración:"
    print_info "  - Límite de productos: $limit"
    print_info "  - Imágenes por producto: $IMAGES_PER_PRODUCT"
    print_info "  - Forzar inicio SD: $force_start_sd"
    print_info "  - Saltar verificación: $skip_verification"
    
    # Cambiar al directorio del proyecto
    cd "$PROJECT_ROOT" || {
        print_error "No se puede acceder al directorio del proyecto: $PROJECT_ROOT"
        exit 1
    }
    
    # Verificaciones iniciales
    if [[ "$skip_verification" != true ]]; then
        check_dependencies || exit 1
    fi
    
    setup_directories || exit 1
    setup_database_connection || exit 1
    
    # Verificar/iniciar Stable Diffusion
    if [[ "$force_start_sd" == true ]]; then
        start_stable_diffusion_background
    fi
    
    verify_stable_diffusion || exit 1
    
    # Obtener productos para procesar
    get_products_without_ai_images "$limit" || exit 1
    
    # Verificar que tenemos productos
    local products_file="$TEMP_DIR/products_to_process.json"
    if [[ ! -f "$products_file" ]]; then
        print_error "No se encontró archivo de productos"
        exit 1
    fi
    
    local product_count=$(jq '. | length' "$products_file")
    if [[ "$product_count" -eq 0 ]]; then
        print_warning "No hay productos para procesar"
        exit 0
    fi
    
    print_info "Procesando $product_count productos..."
    
    # Procesar cada producto
    local processed=0
    local errors=0
    
    for i in $(seq 0 $((product_count - 1))); do
        local product_data=$(jq ".[$i]" "$products_file")
        local product_name=$(echo "$product_data" | jq -r '.name_es // .name')
        
        print_info "Progreso: $((i + 1))/$product_count - $product_name"
        
        if process_product_images "$product_data"; then
            ((processed++))
        else
            ((errors++))
            print_error "Error procesando: $product_name"
        fi
        
        # Pausa entre productos
        sleep 3
    done
    
    # Resumen final
    print_header "RESUMEN FINAL"
    print_success "Productos procesados exitosamente: $processed"
    if [[ $errors -gt 0 ]]; then
        print_warning "Productos con errores: $errors"
    fi
    print_info "Total de productos procesados: $product_count"
    print_info "Imágenes generadas estimadas: $((processed * IMAGES_PER_PRODUCT))"
    
    # Limpiar archivos temporales
    rm -rf "$TEMP_DIR"
    
    print_success "¡Automatización completada!"
    print_info "Las imágenes están disponibles en: $IMAGES_OUTPUT_DIR"
    print_info "Los productos fueron actualizados en la base de datos"
}

# ===============================================
# 🎯 PUNTO DE ENTRADA
# ===============================================

# Manejar señales para limpieza
trap 'echo -e "\n${RED}❌ Script interrumpido por el usuario${NC}"; rm -rf "$TEMP_DIR" 2>/dev/null; exit 130' INT TERM

# Ejecutar función principal con todos los argumentos
main "$@"