# 🎨 Stable Diffusion Automation System

Sistema completo de automatización que integra Stable Diffusion WebUI con tu base de datos de productos para generar imágenes automáticamente.

## 🚀 Inicio Rápido

### 1. Configuración Inicial (Una sola vez)

```bash
# En Git Bash
bash scripts/sd_setup.bash
```

### 2. Iniciar Stable Diffusion WebUI

```bash
# En una ventana separada (PowerShell o Command Prompt)
C:\AI\stable-diffusion\stable-diffusion-webui\webui-user.bat
```

**Esperar hasta ver:** `Running on local URL: http://127.0.0.1:7860`

### 3. Probar la Conexión

```bash
# En Git Bash
bash scripts/sd_quick_test.bash
```

### 4. Ejecutar Automatización

```bash
# Procesar 5 productos (recomendado para prueba)
bash scripts/sd_automation_master.bash --limit 5

# Procesar 20 productos
bash scripts/sd_automation_master.bash --limit 20

# Forzar inicio de SD WebUI si no está corriendo
bash scripts/sd_automation_master.bash --force-start-sd --limit 10
```

## 📋 Requisitos

- ✅ **Git Bash** instalado
- ✅ **Python 3.x** en PATH
- ✅ **Stable Diffusion WebUI** instalado en `C:\AI\stable-diffusion\stable-diffusion-webui`
- ✅ **Variables de entorno** configuradas (SUPABASE_URL, SUPABASE_KEY)
- ✅ **Modelo SD** descargado (ej: Realistic Vision, DreamShaper)

## 🎯 ¿Qué hace el sistema?

1. **📊 Consulta la base de datos** → Obtiene productos sin imágenes AI
2. **🎨 Genera prompts inteligentes** → Basados en nombre y categoría del producto
3. **🖼️ Genera 3 imágenes por producto**:
   - Vista profesional con fondo blanco
   - Vista lateral estilo catálogo
   - Vista lifestyle con ambiente
4. **📁 Optimiza y guarda** → En `public/ai-generated/`
5. **💾 Actualiza base de datos** → Agrega URLs de nuevas imágenes al campo `images`

## 🛠️ Opciones Avanzadas

### Parámetros del Script Principal

```bash
# Ayuda completa
bash scripts/sd_automation_master.bash --help

# Opciones disponibles
--limit N                  # Número de productos (default: 5)
--force-start-sd          # Iniciar SD WebUI automáticamente  
--skip-verification       # Saltar verificaciones de dependencias
```

### Configuración de Generación

Editar en `sd_automation_master.bash`:

```bash
DEFAULT_WIDTH=512          # Ancho de imagen
DEFAULT_HEIGHT=512         # Alto de imagen  
DEFAULT_STEPS=25           # Pasos de generación (calidad vs velocidad)
DEFAULT_CFG_SCALE=7.5      # Adherencia al prompt
IMAGES_PER_PRODUCT=3       # Imágenes por producto
```

## 🔍 Troubleshooting

### ❌ "SD WebUI no está corriendo"
**Solución:** Inicia manualmente `webui-user.bat` y espera a que cargue completamente

### ❌ "Variables de Supabase no configuradas"  
**Solución:** Verificar que `.env` tiene:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### ❌ "jq no está disponible"
**Solución:** El script intenta instalarlo automáticamente, si falla:
```bash
winget install jqlang.jq
```

### ❌ "Error al generar imagen"
**Solución:** 
- Verificar que hay un modelo descargado en SD WebUI
- Verificar que `--api` está en `COMMANDLINE_ARGS` del `webui-user.bat`
- Probar generar una imagen manualmente en la interfaz web

### ❌ "Error al actualizar base de datos"
**Solución:**
- Verificar conexión a internet
- Verificar que las credenciales de Supabase son correctas
- Verificar que la tabla `products` tiene el campo `images` (tipo JSON)

## 📁 Estructura de Archivos

```
scripts/
├── sd_automation_master.bash    # Script principal 
├── sd_setup.bash               # Configuración inicial
└── sd_quick_test.bash          # Prueba de conexión (se crea automáticamente)

public/
└── ai-generated/               # Imágenes generadas
    ├── ai_product-id-1_1.png   # Imagen 1 del producto
    ├── ai_product-id-1_2.png   # Imagen 2 del producto
    └── ai_product-id-1_3.png   # Imagen 3 del producto

temp_sd_processing/             # Archivos temporales (se borran automáticamente)
logs/                          # Logs del sistema
```

## 🎨 Personalización de Prompts

Para cambiar los estilos de imagen, editar en `sd_automation_master.bash` la función `generate_product_prompts()`:

```bash
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
esac
```

## ⚡ Performance Tips

- **PC con mucha RAM**: Aumentar `IMAGES_PER_PRODUCT` a 4-5
- **GPU potente**: Reducir `DEFAULT_STEPS` a 20 para mayor velocidad
- **Procesamiento masivo**: Ejecutar por lotes de 10-20 productos
- **Calidad máxima**: Aumentar `DEFAULT_STEPS` a 30-40

## 🎊 Resultado Esperado

Cada producto pasará de tener **1 imagen** (de CJ Dropshipping) a tener **4+ imágenes** (original + 3 generadas por IA), mejorando significativamente la presentación en tu tienda.

Las imágenes aparecerán automáticamente en el componente de galería de `ProductDetail` sin necesidad de cambios adicionales en el código.

---

**✨ Sistema desarrollado con Warp AI Assistant - Octubre 2025**