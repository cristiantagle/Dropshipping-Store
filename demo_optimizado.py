#!/usr/bin/env python3
"""
🔥 DEMO OPTIMIZADO PARA LLAMA 3 70B
Versión corregida con timeout adecuado y prompts optimizados
"""

import os
import requests
import json
import time

def load_env():
    """Cargar variables del .env"""
    env_vars = {}
    try:
        with open('.env', 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for line in lines:
            if line.startswith('OLLAMA_'):
                key, value = line.strip().split('=', 1)
                value = value.split('#')[0].strip()
                os.environ[key] = value
                env_vars[key] = value
                
        print("✅ Variables cargadas:")
        for key, value in env_vars.items():
            print(f"   {key} = {value}")
        print()
        
    except Exception as e:
        print(f'⚠️ Error cargando .env: {e}')
    
    return env_vars

def call_ollama_optimized(model, prompt, max_tokens=200, show_progress=True):
    """Llamar a Ollama con configuración optimizada"""
    url = os.environ.get('OLLAMA_URL', 'http://localhost:11434/api/generate')
    timeout = int(os.environ.get('OLLAMA_TIMEOUT', '300'))  # Usar 300s por defecto
    
    if show_progress:
        print(f"🔗 URL: {url}")
        print(f"⏱️ Timeout configurado: {timeout}s")
        print(f"🎯 Tokens máximos: {max_tokens}")
    
    start_time = time.time()
    
    try:
        response = requests.post(url, 
            json={
                'model': model,
                'prompt': prompt,
                'stream': False,
                'options': {
                    'num_predict': max_tokens,
                    'temperature': 0.7,
                    'top_p': 0.9,
                    'repeat_penalty': 1.1
                }
            },
            timeout=timeout)
        
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            response_text = result.get('response', '').strip()
            
            if show_progress:
                print(f"✅ Respuesta recibida en {elapsed:.1f}s")
                
            return response_text
        else:
            return f"❌ Error HTTP {response.status_code}: {response.text[:100]}"
            
    except requests.exceptions.Timeout:
        elapsed = time.time() - start_time
        return f"⏱️ TIMEOUT después de {elapsed:.1f}s (límite: {timeout}s)"
    except Exception as e:
        elapsed = time.time() - start_time
        return f"❌ Error después de {elapsed:.1f}s: {e}"

def test_single_model(model_name, test_prompt="Di 'hola' en español chileno"):
    """Probar un modelo específico rápidamente"""
    print(f"\n🧪 PRUEBA RÁPIDA: {model_name}")
    print("=" * 50)
    
    result = call_ollama_optimized(model_name, test_prompt, max_tokens=30)
    print(f"📝 Resultado: {result}")
    
    return not result.startswith("❌") and not result.startswith("⏱️")

def create_optimized_description(spanish_name, category):
    """Crear descripción con prompt optimizado para Llama 3 70B"""
    
    print(f"\n🦙 DESCRIPCIÓN PREMIUM (Llama 3 70B)")
    print("⌛ Generando con prompt optimizado...")
    
    # Prompt más directo y específico
    optimized_prompt = f"""Crea una descripción comercial de {spanish_name} para tienda online chilena.

Requisitos:
- 100-120 palabras exactas
- Menciona 3 beneficios principales  
- Incluye casos de uso
- Español chileno natural
- Tono persuasivo pero profesional

Producto: {spanish_name}
Categoría: {category}

Descripción:"""

    result = call_ollama_optimized('llama3:70b', optimized_prompt, max_tokens=150, show_progress=True)
    
    print(f"📝 Resultado:")
    print(f"{result}")
    
    return result

def demo_step_by_step():
    """Demo paso a paso optimizado"""
    print("🔥 DEMO PASO A PASO OPTIMIZADO")
    print("=" * 60)
    
    env_vars = load_env()
    
    # Verificar configuración
    timeout_configured = env_vars.get('OLLAMA_TIMEOUT', '120')
    print(f"🔧 Timeout configurado: {timeout_configured}s")
    
    if int(timeout_configured) < 300:
        print("⚠️ ADVERTENCIA: Timeout puede ser insuficiente para Llama 3 70B")
        print("💡 Recomendación: OLLAMA_TIMEOUT=300 en .env")
    
    # Productos de prueba más simples
    test_products = [
        ("Wireless Headphones", "tecnologia"),
        ("Water Bottle", "hogar")
    ]
    
    for product_name, category in test_products:
        print(f"\n{'='*60}")
        print(f"📦 PROCESANDO: {product_name}")
        print(f"{'='*60}")
        
        # PASO 1: Traducción (rápida)
        print(f"\n🎯 PASO 1: Traducción con Mixtral 8x7B")
        translate_prompt = f'Traduce al español chileno comercial: "{product_name}". Solo responde la traducción.'
        
        spanish_name = call_ollama_optimized('mixtral:8x7b', translate_prompt, 30, show_progress=False)
        print(f"✅ Traducción: {spanish_name}")
        
        if spanish_name.startswith("❌") or spanish_name.startswith("⏱️"):
            print("⚠️ Saltando al siguiente producto debido a error en traducción")
            continue
            
        # PASO 2: Descripción (la problemática)
        description = create_optimized_description(spanish_name, category)
        
        if description.startswith("❌") or description.startswith("⏱️"):
            print("⚠️ Error en descripción, probando con modelo más rápido...")
            
            # Fallback a Mixtral para descripción
            print(f"\n🔄 FALLBACK: Descripción con Mixtral 8x7b")
            fallback_prompt = f'Crea descripción de 80 palabras para "{spanish_name}" en español chileno comercial.'
            fallback_desc = call_ollama_optimized('mixtral:8x7b', fallback_prompt, 100, show_progress=False)
            print(f"📝 Descripción (Mixtral): {fallback_desc}")
        
        # PASO 3: Specs (rápidas)
        print(f"\n💻 PASO 3: Especificaciones con CodeLlama 34B")
        specs_prompt = f'JSON de especificaciones para "{spanish_name}": material, dimensiones, peso, colores. Solo JSON:'
        
        specs = call_ollama_optimized('codellama:34b', specs_prompt, 100, show_progress=False)
        print(f"✅ Especificaciones: {specs[:100]}...")
        
        print(f"\n{'='*60}")
        print(f"🎉 PRODUCTO COMPLETADO")
        print(f"{'='*60}")
        
        # Pausa entre productos
        time.sleep(5)

def main():
    """Función principal"""
    print("🔥 DEMO OPTIMIZADO PARA TU SISTEMA PREMIUM")
    print("Timeout corregido + Prompts optimizados para Llama 3 70B")
    print("━" * 70)
    
    # Menú de opciones
    print("\n📋 OPCIONES:")
    print("1. Prueba rápida de modelos")
    print("2. Demo completo paso a paso")
    print("3. Solo probar Llama 3 70B con descripción")
    
    choice = input("\n🎯 Elige opción (1-3): ").strip()
    
    if choice == "1":
        print("\n🧪 PRUEBAS RÁPIDAS")
        test_single_model('mixtral:8x7b', 'Hola')
        test_single_model('codellama:34b', 'Lista 2 materiales')
        test_single_model('llama3:70b', 'Di hola en español')
        
    elif choice == "2":
        demo_step_by_step()
        
    elif choice == "3":
        load_env()
        create_optimized_description("Auriculares Bluetooth Premium", "tecnologia")
        
    else:
        print("🔄 Ejecutando demo completo por defecto...")
        demo_step_by_step()
    
    print(f"\n🎊 DEMO COMPLETADO")
    print("💡 Si Llama 3 70B sigue dando timeout, considera usar Mixtral 8x7B como alternativa")

if __name__ == '__main__':
    main()