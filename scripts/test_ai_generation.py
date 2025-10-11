#!/usr/bin/env python3
"""
🧪 Script de Prueba para Generación de Imágenes AI
Genera una imagen de prueba para verificar que todo funciona
"""

import requests
import json
import base64
import os
import time

def test_stable_diffusion():
    """Probar que Stable Diffusion está funcionando"""
    webui_url = "http://127.0.0.1:7860"
    
    print("🧪 PRUEBA DE GENERACIÓN DE IMÁGENES AI")
    print("=" * 40)
    
    # Verificar conexión
    try:
        print("🔍 Verificando conexión con Stable Diffusion WebUI...")
        response = requests.get(f"{webui_url}/sdapi/v1/progress", timeout=5)
        if response.status_code != 200:
            print("❌ WebUI no responde correctamente")
            return False
        print("✅ Conexión exitosa!")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        print("   Asegúrate de que Stable Diffusion WebUI esté corriendo en http://127.0.0.1:7860")
        return False
    
    # Generar imagen de prueba
    print("\n🎨 Generando imagen de prueba...")
    
    prompt = "professional product photography of wireless bluetooth headphones, white background, studio lighting, high quality, detailed, commercial photo"
    negative_prompt = "blurry, low quality, distorted, ugly, text, watermark"
    
    payload = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": 512,
        "height": 512,
        "steps": 20,  # Menos pasos para prueba rápida
        "cfg_scale": 7,
        "sampler_name": "DPM++ 2M Karras",
        "batch_size": 1,
        "n_iter": 1,
        "seed": 42,  # Seed fijo para reproducibilidad
    }
    
    try:
        print("   📸 Enviando solicitud a Stable Diffusion...")
        start_time = time.time()
        
        response = requests.post(
            f"{webui_url}/sdapi/v1/txt2img", 
            json=payload,
            timeout=60
        )
        
        end_time = time.time()
        generation_time = end_time - start_time
        
        if response.status_code == 200:
            result = response.json()
            
            # Guardar imagen de prueba
            os.makedirs("test_output", exist_ok=True)
            image_data = base64.b64decode(result['images'][0])
            
            with open("test_output/ai_test_image.png", "wb") as f:
                f.write(image_data)
            
            print(f"   ✅ ¡Imagen generada exitosamente!")
            print(f"   ⏱️ Tiempo: {generation_time:.1f} segundos")
            print(f"   📁 Guardada en: test_output/ai_test_image.png")
            
            # Mostrar información del modelo usado
            try:
                model_info = requests.get(f"{webui_url}/sdapi/v1/options")
                if model_info.status_code == 200:
                    model_data = model_info.json()
                    current_model = model_data.get('sd_model_checkpoint', 'Desconocido')
                    print(f"   🤖 Modelo usado: {current_model}")
            except:
                pass
            
            return True
            
        else:
            print(f"   ❌ Error HTTP {response.status_code}")
            print(f"   📝 Respuesta: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error generando imagen: {e}")
        return False

def show_setup_info():
    """Mostrar información de configuración"""
    print("\n📋 INFORMACIÓN DE CONFIGURACIÓN:")
    print("-" * 35)
    print("🌐 WebUI URL: http://127.0.0.1:7860")
    print("📁 Imágenes de prueba: test_output/")
    print("📁 Imágenes de productos: public/ai-generated/")
    print("\n💡 Para generar imágenes de tus productos:")
    print("   python scripts/ai_image_generator.py --limit 5")

if __name__ == "__main__":
    success = test_stable_diffusion()
    
    if success:
        print("\n🎉 ¡PRUEBA EXITOSA! Tu setup de Stable Diffusion está funcionando perfectamente.")
        print("   Ya puedes generar imágenes AI para tus productos de la tienda.")
        show_setup_info()
    else:
        print("\n😞 La prueba falló. Por favor:")
        print("   1. Asegúrate de que Stable Diffusion WebUI esté corriendo")
        print("   2. Verifica que tengas al menos un modelo descargado")
        print("   3. Ejecuta: C:\\AI\\stable-diffusion\\stable-diffusion-webui\\webui-user.bat")
        print("   4. Espera a que aparezca: 'Running on local URL: http://127.0.0.1:7860'")
    
    input("\nPresiona Enter para continuar...")