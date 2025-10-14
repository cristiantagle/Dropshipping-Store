#!/bin/bash
# 🎨 INSTALADOR DE STABLE DIFFUSION PARA GIT BASH (WINDOWS)
# Optimizado para PC con 64GB RAM

echo "🎨 INSTALACIÓN DE STABLE DIFFUSION PARA GENERACIÓN DE IMÁGENES"
echo "============================================================="
echo ""
echo "⚡ Este script instalará Automatic1111 WebUI para generar imágenes AI"
echo "   Tu PC con 64GB RAM es PERFECTO para este setup!"
echo ""

# Verificar que estamos en Windows con Git Bash
if ! command -v winpty &> /dev/null; then
    echo "❌ Este script está diseñado para Git Bash en Windows"
    exit 1
fi

echo "🔍 Verificando dependencias..."

# Verificar Git
if ! command -v git &> /dev/null; then
    echo "❌ Git no encontrado. Instala Git desde: https://git-scm.com/"
    read -p "Presiona Enter para abrir la página de descarga..."
    start "https://git-scm.com/"
    exit 1
fi
echo "   ✅ Git encontrado: $(git --version)"

# Verificar Python (opcional, WebUI lo descarga automáticamente)
if command -v python &> /dev/null; then
    echo "   ✅ Python encontrado: $(python --version)"
else
    echo "   ⚠️ Python no encontrado (WebUI lo descargará automáticamente)"
fi

echo ""
echo "📁 Creando directorio para Stable Diffusion..."

# Crear directorio base
mkdir -p "/c/AI/stable-diffusion"
if [ $? -eq 0 ]; then
    echo "   ✅ Directorio creado: /c/AI/stable-diffusion"
else
    echo "   ⚠️ El directorio ya existe o hubo un problema"
fi

cd "/c/AI/stable-diffusion"

echo ""
echo "📦 Clonando Automatic1111 WebUI..."

if [ ! -d "stable-diffusion-webui" ]; then
    echo "   🔄 Descargando repositorio..."
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
    if [ $? -eq 0 ]; then
        echo "   ✅ Repositorio clonado exitosamente"
    else
        echo "   ❌ Error clonando repositorio"
        exit 1
    fi
else
    echo "   ✅ Repositorio ya existe"
    echo "   🔄 Actualizando repositorio..."
    cd stable-diffusion-webui
    git pull
    cd ..
fi

cd stable-diffusion-webui

echo ""
echo "⚙️ Configurando para tu PC con 64GB RAM..."

# Crear archivo de configuración optimizado
cat > webui-user.bat << 'EOF'
@echo off

REM Configuracion optimizada para PC con 64GB RAM
set PYTHON=
set GIT=
set VENV_DIR=

REM Argumentos optimizados para máxima calidad
set COMMANDLINE_ARGS=--api --listen --xformers --opt-split-attention --enable-insecure-extension-access

REM Para modelos XL (si tienes suficiente VRAM)
REM set COMMANDLINE_ARGS=--api --listen --xformers --opt-split-attention --no-half-vae

echo 🚀 Iniciando Stable Diffusion WebUI...
echo    Configuracion: PC Potente (64GB RAM)
echo    API habilitada en: http://127.0.0.1:7860
echo    CTRL+C para detener
echo.

call webui.bat %*
EOF

echo "   ✅ Configuración optimizada creada (webui-user.bat)"

# Crear directorio para modelos si no existe
mkdir -p "models/Stable-diffusion"
echo "   ✅ Directorio de modelos preparado"

echo ""
echo "📋 INSTALACIÓN COMPLETADA - PRÓXIMOS PASOS:"
echo "=========================================="
echo ""
echo "1. 📥 DESCARGAR MODELOS (CRÍTICO - Sin esto no funciona):"
echo ""
echo "   🎯 MODELO PRINCIPAL (Recomendado):"
echo "   - Realistic Vision V6.0 (~4GB)"
echo "   - URL: https://civitai.com/models/4201/realistic-vision-v60-b1"
echo "   - Archivo: realisticVisionV60B1_v60B1VAE.safetensors"
echo ""
echo "   🎨 MODELO ALTERNATIVO:"
echo "   - DreamShaper XL (~6GB)" 
echo "   - URL: https://civitai.com/models/112902/dreamshaper-xl"
echo "   - Archivo: dreamshaperXL_v21TurboDPMSDE.safetensors"
echo ""
echo "   📁 COLOCAR EN: /c/AI/stable-diffusion/stable-diffusion-webui/models/Stable-diffusion/"
echo ""

echo "2. 🚀 INICIAR STABLE DIFFUSION:"
echo "   cd /c/AI/stable-diffusion/stable-diffusion-webui"
echo "   ./webui-user.bat"
echo ""
echo "   ⏳ Primera ejecución: 10-15 minutos (descarga dependencias)"
echo "   🌐 Una vez listo: http://127.0.0.1:7860"
echo ""

echo "3. 🧪 PROBAR SISTEMA:"
echo "   # En otra terminal de Git Bash:"
echo "   cd /c/Users/Cristian\ Tagle/Desktop/Lunaria-Web/Dropshipping-Store"
echo "   python scripts/test_ai_generation.py"
echo ""

echo "4. 🎨 GENERAR IMÁGENES PARA PRODUCTOS:"
echo "   python scripts/ai_image_generator.py --limit 5"
echo ""

echo "💡 CONFIGURACIÓN PARA TU PC:"
echo "   - RAM: Usará 8-12GB para modelos grandes"
echo "   - Velocidad: 5-15 segundos por imagen"
echo "   - Calidad: Profesional para e-commerce"
echo ""

# Preguntar si quiere abrir enlaces útiles
echo "🤖 ¿Abrir enlaces para descargar modelos? (y/n)"
read -r choice
if [[ $choice =~ ^[Yy]$ ]]; then
    echo "   🌐 Abriendo enlaces..."
    start "https://civitai.com/models/4201/realistic-vision-v60-b1"
    start "https://civitai.com/models/112902/dreamshaper-xl" 
    start "file:///c/AI/stable-diffusion/stable-diffusion-webui/models/Stable-diffusion"
    echo "   ✅ Enlaces abiertos en tu navegador"
fi

echo ""
echo "🎊 INSTALACIÓN COMPLETADA CON ÉXITO!"
echo ""
echo "📋 COMANDOS QUICK START:"
echo ""
echo "# 1. Iniciar WebUI (dejar corriendo)"
echo "cd /c/AI/stable-diffusion/stable-diffusion-webui && ./webui-user.bat"
echo ""
echo "# 2. Probar generación (en otra terminal)"
echo "python scripts/test_ai_generation.py"
echo ""
echo "# 3. Generar para productos"
echo "python scripts/ai_image_generator.py --limit 10"
echo ""
echo "🔥 ¡Tu sistema de imágenes AI está listo!"

# Preguntar si quiere ejecutar inmediatamente
echo ""
echo "🚀 ¿Quieres iniciar Stable Diffusion ahora? (y/n)"
read -r start_now
if [[ $start_now =~ ^[Yy]$ ]]; then
    echo "🔥 Iniciando Stable Diffusion WebUI..."
    echo "   📝 NOTA: La primera ejecución puede tomar 10-15 minutos"
    echo "   💡 Una vez que veas 'Running on local URL', estará listo"
    echo ""
    echo "Presiona CTRL+C para volver aquí cuando termine de cargar..."
    sleep 2
    ./webui-user.bat
fi

echo ""
echo "✨ Setup completado exitosamente con Git Bash!"