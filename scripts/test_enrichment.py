#!/usr/bin/env python3
"""
🧪 SCRIPT DE PRUEBA DEL SISTEMA DE ENRIQUECIMIENTO
Prueba rápida de Ollama y OpenAI para enriquecimiento de productos
"""

import os
import requests
import json
from typing import Optional

def test_ollama() -> bool:
    """Probar conexión y funcionamiento de Ollama"""
    print("🤖 Probando Ollama local...")
    
    try:
        url = os.getenv('OLLAMA_URL', 'http://localhost:11434/api/generate')
        model = os.getenv('OLLAMA_MODEL', 'llama3:8b')
        
        response = requests.post(
            url,
            json={
                'model': model,
                'prompt': 'Describe en 2 líneas qué es un auricular bluetooth.',
                'stream': False,
                'options': {'temperature': 0.7, 'num_predict': 100}
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            answer = result.get('response', '').strip()
            print(f"✅ Ollama funciona correctamente!")
            print(f"📝 Respuesta: {answer[:100]}...")
            return True
        else:
            print(f"❌ Ollama error {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Ollama no disponible: {e}")
        return False

def test_openai() -> bool:
    """Probar conexión y funcionamiento de OpenAI"""
    print("\n🧠 Probando OpenAI API...")
    
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("⚠️  OpenAI API key no configurada")
        return False
    
    try:
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {'role': 'user', 'content': 'Describe en 2 líneas qué es un auricular bluetooth.'}
                ],
                'max_tokens': 100,
                'temperature': 0.7
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            answer = result['choices'][0]['message']['content'].strip()
            print(f"✅ OpenAI funciona correctamente!")
            print(f"📝 Respuesta: {answer[:100]}...")
            return True
        else:
            print(f"❌ OpenAI error {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ OpenAI error: {e}")
        return False

def test_product_enrichment() -> None:
    """Probar generación completa de contenido para un producto ejemplo"""
    print("\n🎨 Probando enriquecimiento completo...")
    
    # Datos de producto ejemplo
    test_product = {
        'name': 'Wireless Bluetooth Headphones',
        'name_es': 'Auriculares Inalámbricos Bluetooth',
        'category': 'tecnologia'
    }
    
    # Probar cada tipo de prompt
    test_prompts = {
        'descripción': f"""
        Basándote en el nombre del producto "{test_product['name_es']}" y categoría "{test_product['category']}", 
        crea una descripción rica y atractiva de 100 palabras que incluya beneficios y casos de uso.
        Escribe en español chileno.
        """,
        
        'características': f"""
        Lista 4 características clave del producto "{test_product['name_es']}" que un cliente 
        querría saber antes de comprar. Formato: lista simple.
        """,
        
        'especificaciones': f"""
        Para "{test_product['name_es']}", genera especificaciones técnicas en formato JSON:
        {{"Material": "valor", "Batería": "horas", "Conectividad": "tipo", "Colores": "opciones"}}
        """
    }
    
    # Probar con el modelo disponible
    ollama_works = test_ollama()
    openai_works = test_openai()
    
    if not ollama_works and not openai_works:
        print("❌ Ningún modelo de IA disponible para prueba completa")
        return
    
    print(f"\n📋 Generando contenido con {'Ollama' if ollama_works else 'OpenAI'}...")
    
    for prompt_type, prompt in test_prompts.items():
        print(f"\n🔸 {prompt_type.upper()}:")
        
        try:
            if ollama_works:
                # Usar Ollama
                response = requests.post(
                    os.getenv('OLLAMA_URL', 'http://localhost:11434/api/generate'),
                    json={
                        'model': os.getenv('OLLAMA_MODEL', 'llama3:8b'),
                        'prompt': f"Eres un experto en marketing. {prompt}",
                        'stream': False,
                        'options': {'temperature': 0.7, 'num_predict': 200}
                    },
                    timeout=45
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result.get('response', '').strip()
                    print(f"✅ {content[:150]}...")
                else:
                    print(f"❌ Error generando {prompt_type}")
                    
            elif openai_works:
                # Usar OpenAI como backup
                response = requests.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'gpt-3.5-turbo',
                        'messages': [
                            {'role': 'system', 'content': 'Eres un experto en marketing.'},
                            {'role': 'user', 'content': prompt}
                        ],
                        'max_tokens': 200,
                        'temperature': 0.7
                    },
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content'].strip()
                    print(f"✅ {content[:150]}...")
                else:
                    print(f"❌ Error generando {prompt_type}")
        
        except Exception as e:
            print(f"❌ Error: {e}")

def main():
    """Función principal de prueba"""
    print("🧪 PRUEBA DEL SISTEMA DE ENRIQUECIMIENTO DE PRODUCTOS")
    print("=" * 60)
    
    # Probar modelos individuales
    ollama_ok = test_ollama()
    openai_ok = test_openai()
    
    # Resumen de disponibilidad
    print(f"\n📊 RESUMEN DE DISPONIBILIDAD:")
    print(f"🤖 Ollama Local: {'✅ Disponible' if ollama_ok else '❌ No disponible'}")
    print(f"🧠 OpenAI API: {'✅ Disponible' if openai_ok else '❌ No disponible'}")
    
    if ollama_ok:
        print(f"💡 Recomendación: Usar Ollama (gratis y rápido)")
    elif openai_ok:
        print(f"💡 Recomendación: Usar OpenAI (pago pero confiable)")
    else:
        print(f"⚠️  Instala Ollama con: scripts/install_ollama.bat")
        return
    
    # Probar enriquecimiento completo
    test_product_enrichment()
    
    print(f"\n🎉 Prueba completada!")
    print(f"Para enriquecer productos reales:")
    print(f"python scripts/product_enricher.py --limit 5 --dry-run")

if __name__ == '__main__':
    main()