#!/usr/bin/env python3
"""
Generador de Imágenes AI para Productos
Genera variaciones de imágenes usando Stable Diffusion local
"""

import os
import json
import base64
import time
import requests
from pathlib import Path
from urllib.parse import urlparse
import argparse
from dotenv import load_dotenv
from supabase import create_client, Client

# Cargar variables de entorno
load_dotenv()

# Inicializar Supabase
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    raise Exception("Error: Variables de entorno de Supabase no encontradas")

supabase: Client = create_client(supabase_url, supabase_key)


class ProductImageAI:
    def __init__(self, webui_url="http://127.0.0.1:7860", output_dir="public/ai-generated"):
        self.webui_url = webui_url
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.supabase = supabase

    def check_webui_status(self):
        try:
            response = requests.get(f"{self.webui_url}/sdapi/v1/progress")
            return response.status_code == 200
        except Exception:
            return False

    def clean_product_name(self, name):
        cleaned = name.replace('"', '').replace("'", "").replace('&', 'and')
        words = cleaned.split()[:6]
        return ' '.join(words)

    def generate_product_variations(self, product_id, product_name, count=3):
        clean_name = self.clean_product_name(product_name)
        print(f"Generando {count} imágenes para: {clean_name}")

        prompt_templates = [
            f"professional product photography of {clean_name}, white background, studio lighting, high quality, detailed, commercial photo",
            f"side view of {clean_name}, clean white background, professional lighting, product catalog style, high resolution",
            f"top view of {clean_name}, flat lay photography, white background, professional studio lighting, commercial photography",
            f"close-up detail shot of {clean_name}, macro photography, white background, sharp focus, professional lighting",
            f"{clean_name} on elegant surface, soft shadows, lifestyle photography, modern aesthetic, clean composition",
        ]

        negative_prompt = "blurry, low quality, distorted, ugly, bad anatomy, text, watermark, signature, low resolution, artifacts, noise"

        generated_images = []

        for i in range(count):
            prompt = prompt_templates[i % len(prompt_templates)]
            try:
                print(f"  Generando imagen {i+1}/{count}...")
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
                response = requests.post(f"{self.webui_url}/sdapi/v1/txt2img", json=payload, timeout=120)
                response.raise_for_status()
                data = response.json()
                images = data.get("images", [])
                for idx, img_b64 in enumerate(images):
                    img_bytes = base64.b64decode(img_b64)
                    filename = f"ai_{product_id}_{int(time.time())}_{i+1}.png"
                    out_path = Path(self.output_dir) / filename
                    with open(out_path, "wb") as f:
                        f.write(img_bytes)
                    generated_images.append(str(out_path).replace('\\', '/'))
            except Exception as e:
                print(f"  Error generando imagen {i+1}: {e}")

        return generated_images


def get_products(limit=5):
    try:
        resp = supabase.table('products').select('*').limit(limit).execute()
        if not resp.data:
            print("No se encontraron productos en Supabase")
            return []
        return resp.data
    except Exception as e:
        print(f"Error obteniendo productos: {e}")
        return []


def update_product_images(product_id, new_images, original_image=None):
    try:
        all_images = []
        if original_image:
            all_images.append(original_image)
        all_images.extend(new_images)
        supabase.table('products').update({'images': all_images}).eq('id', product_id).execute()
        print(f"    Base de datos actualizada con {len(all_images)} imágenes")
        return True
    except Exception as e:
        print(f"    Error actualizando Supabase: {e}")
        return False


def process_products(limit=10):
    ai_generator = ProductImageAI()

    if not ai_generator.check_webui_status():
        print("Stable Diffusion WebUI no está corriendo")
        return

    print("Stable Diffusion WebUI detectado y funcionando")

    products = get_products(limit)
    if not products:
        return

    print(f"\nProcesando {len(products)} productos...")

    for i, product in enumerate(products, 1):
        print(f"\n[{i}/{len(products)}] Producto: {product['name'][:50]}...")
        ai_images = ai_generator.generate_product_variations(product['id'], product['name'], count=3)
        if ai_images:
            original = None
            if isinstance(product.get('images'), list) and product['images']:
                original = product['images'][0]
            else:
                original = product.get('image_url')
            success = update_product_images(product['id'], ai_images, original)
            if not success:
                print("    Imágenes generadas pero error al actualizar BD")
        else:
            print("    No se generaron imágenes para este producto")

    print(f"\nProceso completado! Se procesaron {len(products)} productos")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generar imágenes AI para productos')
    parser.add_argument('--limit', type=int, default=5, help='Número de productos a procesar (default: 5)')
    args = parser.parse_args()

    print("GENERADOR DE IMÁGENES AI PARA PRODUCTOS")
    print("=" * 45)
    process_products(limit=args.limit)

