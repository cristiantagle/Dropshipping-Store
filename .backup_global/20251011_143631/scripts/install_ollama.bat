@echo off
:: 🤖 INSTALADOR AUTOMÁTICO DE OLLAMA PARA WINDOWS
:: Script para instalar Ollama y modelos de IA para enriquecimiento de productos

echo 🚀 INSTALADOR DE OLLAMA PARA LUNARIA STORE
echo ==========================================
echo.

:: Verificar si Ollama ya está instalado
ollama --version >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Ollama ya está instalado
    ollama --version
    goto INSTALL_MODELS
)

echo 📥 Descargando e instalando Ollama...
echo.

:: Descargar instalador de Ollama
curl -fsSL https://ollama.com/download/windows -o ollama-windows-amd64.exe
if %errorlevel% neq 0 (
    echo ❌ Error descargando Ollama
    echo Por favor descarga manualmente desde: https://ollama.com/download/windows
    pause
    exit /b 1
)

:: Ejecutar instalador
echo 🔧 Ejecutando instalador...
start /wait ollama-windows-amd64.exe

:: Limpiar archivo descargado
del ollama-windows-amd64.exe

:: Esperar un momento para que termine la instalación
timeout /t 5 /nobreak >nul

:: Verificar instalación
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error en la instalación de Ollama
    echo Por favor reinicia e intenta nuevamente
    pause
    exit /b 1
)

echo ✅ Ollama instalado exitosamente!
echo.

:INSTALL_MODELS
echo 🧠 Descargando modelos de IA...
echo.

echo 🤖 DETECTANDO CAPACIDAD DE TU PC...
echo.

:: Detectar RAM aproximada
for /f "tokens=2 delims==" %%i in ('wmic OS get TotalVisibleMemorySize /value ^| find "="') do set RAM_KB=%%i
set /a RAM_GB=%RAM_KB% / 1024 / 1024

echo 💾 RAM detectada: aproximadamente %RAM_GB%GB
echo.

if %RAM_GB% GEQ 32 (
    echo 🚀 PC POTENTE DETECTADO - Instalando modelos PRO...
    echo.
    echo 📦 Descargando Llama 3 70B (MODELO PREMIUM - 40GB)...
    echo ⚠️  ADVERTENCIA: Esto descargará ~40GB y tomará 30-60 minutos
    echo ⚠️  Solo para PCs con 64GB+ RAM
    echo.
    choice /c YN /m "¿Instalar modelo premium Llama 3 70B?"
    if errorlevel 2 goto STANDARD_MODELS
    ollama pull llama3:70b
    echo.
    echo 📦 Descargando CodeLlama 34B (CÓDIGO Y DOCUMENTACIÓN)...
    ollama pull codellama:34b
    echo.
    echo 📦 Descargando Mixtral 8x7B (MULTILINGÜE AVANZADO)...
    ollama pull mixtral:8x7b
    echo.
    echo 🎯 Modelo principal configurado: llama3:70b
    echo OLLAMA_MODEL=llama3:70b >> .env
) else (
    echo 💻 PC estándar detectado - Instalando modelos optimizados...
    goto STANDARD_MODELS
)
goto MODELS_DONE

:STANDARD_MODELS
echo 📦 Descargando Llama 3 8B (recomendado para PCs estándar)...
echo Esto puede tomar 5-10 minutos dependiendo de tu conexión...
ollama pull llama3:8b

echo.
echo 📦 Descargando Mistral 7B (alternativa más rápida)...
ollama pull mistral:7b

echo 🎯 Modelo principal configurado: llama3:8b
echo OLLAMA_MODEL=llama3:8b >> .env

:MODELS_DONE

echo.
echo ✅ Modelos descargados exitosamente!
echo.

:: Mostrar modelos disponibles
echo 📋 Modelos disponibles:
ollama list

echo.
echo 🧪 Iniciando servidor Ollama...
start "Ollama Server" ollama serve

:: Esperar que el servidor inicie
timeout /t 3 /nobreak >nul

echo.
echo 🧪 Probando modelo con consulta de prueba...
echo.

:: Test básico del modelo
ollama run llama3:8b "Describe en una frase qué es un auricular bluetooth" --timeout 30
if %errorlevel%==0 (
    echo.
    echo ✅ ¡Ollama funcionando correctamente!
) else (
    echo.
    echo ⚠️  Ollama instalado pero necesita configuración manual
)

echo.
echo 🎯 CONFIGURACIÓN PARA TU PROYECTO:
echo ===================================
echo.
echo 1. Variables de entorno recomendadas para .env:
echo    OLLAMA_URL=http://localhost:11434/api/generate
echo    OLLAMA_MODEL=llama3:8b
echo.
echo 2. Para usar en enriquecimiento de productos:
echo    python scripts/product_enricher.py --limit 10
echo.
echo 3. El servidor Ollama se ejecuta en segundo plano
echo    Para detenerlo: Ctrl+C en la ventana "Ollama Server"
echo.
echo 💡 MODELOS DISPONIBLES:
if %RAM_GB% GEQ 32 (
    echo - llama3:70b    (PREMIUM: Mejor calidad del mundo)
    echo - codellama:34b (ESPECIALIZADO: Para documentación técnica)
    echo - mixtral:8x7b  (MULTILINGÜE: Excelente para español)
    echo - llama3:8b     (RESPALDO: Siempre disponible)
) else (
    echo - llama3:8b     (Mejor calidad para este PC)
    echo - mistral:7b    (Buena calidad, más rápido)
)
echo.
echo 🎊 ¡Instalación completada!
echo Tu sistema de enriquecimiento con IA está listo para usar.
echo.

pause