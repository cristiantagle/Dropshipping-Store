@echo off
echo 🎨 INSTALACION DE STABLE DIFFUSION PARA GENERACION DE IMAGENES
echo ============================================================

echo.
echo ⚡ Este script instalara Automatic1111 WebUI para generar imagenes AI
echo    Tu PC con 64GB RAM es PERFECTO para este setup!
echo.

pause

echo 📁 Creando directorio para Stable Diffusion...
if not exist "C:\AI\stable-diffusion" (
    mkdir "C:\AI\stable-diffusion"
    echo    ✅ Directorio creado: C:\AI\stable-diffusion
) else (
    echo    ✅ Directorio ya existe: C:\AI\stable-diffusion
)

cd /d "C:\AI\stable-diffusion"

echo.
echo 📦 Clonando Automatic1111 WebUI...
if not exist "stable-diffusion-webui" (
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error: Git no encontrado. Por favor instala Git desde: https://git-scm.com/
        pause
        exit /b 1
    )
    echo    ✅ Repositorio clonado exitosamente
) else (
    echo    ✅ Repositorio ya existe
)

cd stable-diffusion-webui

echo.
echo ⚙️ Configurando para tu PC con 64GB RAM...
(
    echo @echo off
    echo set PYTHON=
    echo set GIT=
    echo set VENV_DIR=
    echo set COMMANDLINE_ARGS=--xformers --opt-split-attention --api --listen
    echo call webui.bat %%*
) > webui-user.bat

echo    ✅ Configuracion optimizada creada

echo.
echo 📋 INSTRUCCIONES IMPORTANTES:
echo ================================
echo.
echo 1. 📥 DESCARGAR MODELOS (requerido):
echo    - Ve a: https://civitai.com/
echo    - Descarga estos modelos (4-6GB cada uno):
echo      * Realistic Vision V6.0
echo      * DreamShaper XL
echo    - Colocalos en: C:\AI\stable-diffusion\stable-diffusion-webui\models\Stable-diffusion\
echo.
echo 2. 🚀 INICIAR STABLE DIFFUSION:
echo    - Ejecuta: C:\AI\stable-diffusion\stable-diffusion-webui\webui-user.bat
echo    - Espera 10-15 minutos en la primera ejecucion (descarga dependencias)
echo    - Una vez listo, abrir: http://127.0.0.1:7860
echo.
echo 3. 🎨 GENERAR IMAGENES PARA TUS PRODUCTOS:
echo    - Desde tu tienda, ejecutar: python scripts/ai_image_generator.py --limit 5
echo.
echo 4. 💡 TIPS PARA TU PC:
echo    - Con 64GB RAM puedes usar los modelos mas grandes sin problemas
echo    - Velocidad estimada: 10-30 segundos por imagen
echo    - Calidad: Excelente para productos de tienda online
echo.

echo ✅ INSTALACION COMPLETADA!
echo.
echo 🎯 PROXIMOS PASOS:
echo   1. Descargar modelos (ver instrucciones arriba)
echo   2. Ejecutar: webui-user.bat
echo   3. Generar imagenes con: python scripts/ai_image_generator.py
echo.

pause
echo.
echo 🤖 ¿Quieres abrir la carpeta de modelos para descargar?
set /p choice=Presiona Y para abrir, cualquier tecla para salir: 
if /i "%choice%"=="Y" (
    start "" "%cd%\models\Stable-diffusion"
    start "" "https://civitai.com/"
)

echo.
echo 🎊 ¡Setup completo! Diviértete generando imágenes AI para tu tienda!
pause