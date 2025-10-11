# 🎨 Configuración de Stable Diffusion para Generar Imágenes de Productos

## 🚀 Opción 1: Automatic1111 WebUI (Recomendada)

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# 2. Ejecutar (descargará automáticamente Python y dependencias)
./webui-user.bat
```

### Modelos recomendados para productos
- **Realistic Vision V6.0** - Para productos realistas
- **DreamShaper XL** - Para variaciones creativas
- **SDXL Base 1.0** - Modelo base potente

## 🚀 Opción 2: ComfyUI (Más flexible)

### Instalación
```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
```

## 🔧 Script de Integración con tu Store

```python
# scripts/generate_product_variations.py
import requests
import json
import base64
import os
from pathlib import Path

class ProductImageGenerator:
    def __init__(self, webui_url="http://127.0.0.1:7860"):
        self.webui_url = webui_url
    
    def generate_variations(self, product_name, base_image_url, count=3):
        """Genera variaciones de imagen basadas en el nombre del producto"""
        
        # Prompts para diferentes variaciones
        prompts = [
            f"product photography of {product_name}, white background, professional lighting, different angle",
            f"studio photo of {product_name}, clean background, side view, high quality",
            f"{product_name} on elegant surface, soft shadows, commercial photography",
            f"close-up detail of {product_name}, macro photography, white background"
        ]
        
        generated_images = []
        
        for i, prompt in enumerate(prompts[:count]):
            try:
                # Llamada a Stable Diffusion API
                payload = {
                    "prompt": prompt,
                    "negative_prompt": "blurry, low quality, distorted, ugly, bad anatomy",
                    "width": 512,
                    "height": 512,
                    "steps": 20,
                    "cfg_scale": 7,
                    "sampler_name": "DPM++ 2M Karras",
                }
                
                response = requests.post(
                    f"{self.webui_url}/sdapi/v1/txt2img", 
                    json=payload
                )
                
                if response.status_code == 200:
                    result = response.json()
                    # Guardar imagen
                    image_data = base64.b64decode(result['images'][0])
                    filename = f"generated_{product_id}_{i}.png"
                    filepath = f"public/generated/{filename}"
                    
                    os.makedirs(os.path.dirname(filepath), exist_ok=True)
                    with open(filepath, "wb") as f:
                        f.write(image_data)
                    
                    generated_images.append(f"/generated/{filename}")
                
            except Exception as e:
                print(f"Error generando imagen {i}: {e}")
        
        return generated_images
```

## 🔄 Integración con tu base de datos

```python
# scripts/enhance_products_with_ai_images.py
import sqlite3
import json
from generate_product_variations import ProductImageGenerator

def enhance_products_with_ai():
    generator = ProductImageGenerator()
    
    # Conectar a la base de datos
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Obtener productos que necesitan imágenes adicionales
    cursor.execute("""
        SELECT id, name, image_url, images 
        FROM Product 
        WHERE images IS NULL OR json_array_length(images) <= 1
        LIMIT 10
    """)
    
    products = cursor.fetchall()
    
    for product_id, name, image_url, current_images in products:
        print(f"🎨 Generando imágenes para: {name}")
        
        # Generar 3 variaciones adicionales
        new_images = generator.generate_variations(name, image_url, count=3)
        
        # Combinar con imagen original
        all_images = [image_url] + new_images
        
        # Actualizar base de datos
        cursor.execute("""
            UPDATE Product 
            SET images = ? 
            WHERE id = ?
        """, (json.dumps(all_images), product_id))
        
        print(f"✅ {len(new_images)} imágenes generadas para {name}")
    
    conn.commit()
    conn.close()
    print("🎉 Proceso completado!")

if __name__ == "__main__":
    enhance_products_with_ai()
```

## ⚡ Setup optimizado para tu PC

### Configuración de memoria para 64GB RAM:
```bash
# En webui-user.bat, agregar:
set COMMANDLINE_ARGS=--xformers --opt-split-attention --medvram-sdxl
```

### Modelos SDXL (para mejor calidad):
```bash
# Descargar modelos SDXL (4-6GB cada uno)
# Colocar en: stable-diffusion-webui/models/Stable-diffusion/
```

## 🎯 Flujo de trabajo propuesto:

1. **Instalar Automatic1111** en tu PC de 64GB
2. **Descargar modelos** especializados en fotografía de productos
3. **Ejecutar script** para generar 3-4 variaciones por producto
4. **Actualizar base de datos** con las nuevas URLs de imágenes
5. **Tu frontend ya funciona** con múltiples imágenes automáticamente

## 📊 Estimaciones:
- **Tiempo por imagen**: 10-30 segundos (dependiendo del modelo)
- **Calidad**: Excelente para productos
- **Costo**: $0 (completamente local)
- **Memoria usada**: 8-12GB RAM + 4-6GB VRAM