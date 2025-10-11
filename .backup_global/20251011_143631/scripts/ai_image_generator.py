#!/usr/bin/env python3
"""
🎨 Generador de Imágenes AI para Productos
Genera variaciones de imágenes usando Stable Diffusion local
"""

import requests
import json
import base64
import os
import sqlite3
import time
from pathlib import Path
from urllib.parse import urlparse
import argparse

class ProductImageAI:
    def __init__(self, webui_url="http://127.0.0.1:7860", output_dir="public/ai-generated"):
        self.webui_url = webui_url
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
    def check_webui_status(self):
        """Verificar si Stable Diffusion WebUI está corriendo"""
        try:
            response = requests.get(f"{self.webui_url}/sdapi/v1/progress")
            return response.status_code == 200
        except:
            return False
    
    def clean_product_name(self, name):
        """Limpiar nombre del producto para mejores prompts"""
        # Remover caracteres especiales y limpiar
        cleaned = name.replace('"', '').replace("'", "").replace('&', 'and')
        # Tomar solo las primeras palabras relevantes
        words = cleaned.split()[:6]  # Limitar a 6 palabras
        return ' '.join(words)
    
    def generate_product_variations(self, product_id, product_name, count=3):
        """Generar variaciones de imágenes para un producto"""
        
        clean_name = self.clean_product_name(product_name)
        print(f"🎨 Generando {count} imágenes para: {clean_name}")
        
        # Templates de prompts para diferentes estilos
        prompt_templates = [
            # Fotografía de producto profesional
            f"professional product photography of {clean_name}, white background, studio lighting, high quality, detailed, commercial photo",
            
            # Vista lateral/ángulo diferente
            f"side view of {clean_name}, clean white background, professional lighting, product catalog style, high resolution",
            
            # Vista desde arriba
            f"top view of {clean_name}, flat lay photography, white background, professional studio lighting, commercial photography",
            
            # Detalle/close-up
            f"close-up detail shot of {clean_name}, macro photography, white background, sharp focus, professional lighting",
            
            # Lifestyle/contextual
            f"{clean_name} on elegant surface, soft shadows, lifestyle photography, modern aesthetic, clean composition"
        ]
        
        negative_prompt = "blurry, low quality, distorted, ugly, bad anatomy, text, watermark, signature, low resolution, artifacts, noise"
        
        generated_images = []
        
        for i in range(count):
            prompt = prompt_templates[i % len(prompt_templates)]
            
            try:
                print(f"  📸 Generando imagen {i+1}/{count}...")
                
                payload = {
                    "prompt": prompt,
                    "negative_prompt": negative_prompt,
                    "width": 512,
                    "height": 512,
                    "steps": 25,
                    "cfg_scale": 7.5,
                    "sampler_name": "DPM++ 2M Karras",
                    "restore_faces": False,
                    "batch_size": 1,
                    "n_iter": 1,
                    "seed": -1,
                }
                
                response = requests.post(
                    f"{self.webui_url}/sdapi/v1/txt2img", 
                    json=payload,
                    timeout=120  # 2 minutos timeout
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Decodificar y guardar imagen
                    image_data = base64.b64decode(result['images'][0])
                    filename = f"ai_{product_id}_{i+1}.png"
                    filepath = os.path.join(self.output_dir, filename)
                    
                    with open(filepath, "wb") as f:
                        f.write(image_data)
                    
                    # URL relativa para la base de datos
                    image_url = f"/ai-generated/{filename}"
                    generated_images.append(image_url)
                    print(f"    ✅ Imagen {i+1} guardada: {filename}")
                    
                else:
                    print(f"    ❌ Error HTTP {response.status_code} en imagen {i+1}")
                
                # Pequeña pausa entre generaciones
                time.sleep(1)
                
            except Exception as e:
                print(f"    ❌ Error generando imagen {i+1}: {e}")
        
        return generated_images

def update_product_images(product_id, new_images, original_image=None):
    """Actualizar base de datos con las nuevas imágenes"""
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Combinar imagen original con nuevas imágenes AI
        all_images = []
        if original_image:
            all_images.append(original_image)
        all_images.extend(new_images)
        
        # Actualizar campo images en JSON
        cursor.execute("""
            UPDATE Product 
            SET images = ? 
            WHERE id = ?
        """, (json.dumps(all_images), product_id))
        
        conn.commit()
        conn.close()
        
        print(f"    💾 Base de datos actualizada con {len(all_images)} imágenes")
        return True
        
    except Exception as e:
        print(f"    ❌ Error actualizando BD: {e}")
        return False

def process_products(limit=10, skip_existing=True):
    """Procesar productos para generar imágenes AI"""
    
    # Verificar si Stable Diffusion está corriendo
    ai_generator = ProductImageAI()
    if not ai_generator.check_webui_status():
        print("❌ Stable Diffusion WebUI no está corriendo en http://127.0.0.1:7860")
        print("   Por favor, inicia Automatic1111 WebUI antes de continuar")
        return
    
    print("✅ Stable Diffusion WebUI detectado y funcionando")
    
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Query para obtener productos
        if skip_existing:
            # Solo productos sin imágenes AI generadas
            query = """
                SELECT id, name, image_url, images 
                FROM Product 
                WHERE name IS NOT NULL 
                AND (images IS NULL OR json_array_length(images) <= 1)
                ORDER BY created_at DESC
                LIMIT ?
            """
        else:
            # Todos los productos
            query = """
                SELECT id, name, image_url, images 
                FROM Product 
                WHERE name IS NOT NULL 
                ORDER BY created_at DESC
                LIMIT ?
            """
        
        cursor.execute(query, (limit,))
        products = cursor.fetchall()
        conn.close()
        
        print(f"\n🔄 Procesando {len(products)} productos...")
        
        for i, (product_id, name, image_url, current_images) in enumerate(products, 1):
            print(f"\n[{i}/{len(products)}] Producto: {name[:50]}...")
            
            # Generar 3 variaciones AI
            ai_images = ai_generator.generate_product_variations(product_id, name, count=3)
            
            if ai_images:
                # Actualizar base de datos
                success = update_product_images(product_id, ai_images, image_url)
                if success:
                    print(f"    🎉 {len(ai_images)} imágenes AI generadas exitosamente")
                else:
                    print(f"    ⚠️ Imágenes generadas pero error al actualizar BD")
            else:
                print(f"    😞 No se generaron imágenes para este producto")
        
        print(f"\n🎊 ¡Proceso completado! Se procesaron {len(products)} productos")
        
    except Exception as e:
        print(f"❌ Error procesando productos: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generar imágenes AI para productos')
    parser.add_argument('--limit', type=int, default=5, help='Número de productos a procesar (default: 5)')
    parser.add_argument('--regenerate', action='store_true', help='Regenerar imágenes incluso si ya existen')
    
    args = parser.parse_args()
    
    print("🎨 GENERADOR DE IMÁGENES AI PARA PRODUCTOS")
    print("=" * 45)
    
    process_products(
        limit=args.limit, 
        skip_existing=not args.regenerate
    )