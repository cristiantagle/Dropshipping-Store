#!/usr/bin/env python3
"""
🔥 SCRIPT DE PRUEBA OLLAMA PREMIUM
Prueba la conexión con los modelos premium instalados
"""

import os
import requests
import time

def load_env():
    """Cargar variables del .env"""
    try:
        with open('.env', 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for line in lines:
            if line.startswith('OLLAMA_'):
                key, value = line.strip().split('=', 1)
                value = value.split('#')[0].strip()  # Remover comentarios
                os.environ[key] = value
                print(f'✅ {key} = {value}')
    except Exception as e:
        print(f'⚠️ Error cargando .env: {e}')

def test_ollama_model(model_name, prompt, max_tokens=50):
    """Probar un modelo específico"""
    url = os.environ.get('OLLAMA_URL', 'http://localhost:11434/api/generate')
    timeout = int(os.environ.get('OLLAMA_TIMEOUT', '120'))
    
    print(f'\n🤖 Probando modelo: {model_name}')
    print(f'🔗 URL: {url}')
    print(f'💬 Prompt: {prompt}')
    print(f'⏱️ Timeout: {timeout}s')
    print('⌛ Generando respuesta...')
    
    start_time = time.time()
    
    try:
        response = requests.post(url, 
            json={
                'model': model_name, 
                'prompt': prompt, 
                'stream': False, 
                'options': {
                    'num_predict': max_tokens,
                    'temperature': 0.7
                }
            }, 
            timeout=timeout)
        
        elapsed = time.time() - start_time
        print(f'📊 Status: {response.status_code} | ⏱️ Tiempo: {elapsed:.1f}s')
        
        if response.status_code == 200:
            result = response.json()
            response_text = result.get('response', 'Sin respuesta').strip()
            print(f'✅ ÉXITO!')
            print(f'📝 Respuesta: {response_text}')
            return True
        else:
            print(f'❌ Error HTTP: {response.status_code}')
            print(f'📄 Detalles: {response.text[:300]}')
            return False
            
    except requests.exceptions.Timeout:
        elapsed = time.time() - start_time
        print(f'⏱️ Timeout después de {elapsed:.1f}s - El modelo puede estar procesando')
        return False
    except Exception as e:
        elapsed = time.time() - start_time
        print(f'❌ Error después de {elapsed:.1f}s: {e}')
        return False

def main():
    print('🔥 PRUEBA DE MODELOS OLLAMA PREMIUM')
    print('=' * 50)
    
    # Cargar configuración
    load_env()
    
    # Modelos a probar (del más rápido al más lento)
    tests = [
        ('llama3:70b', 'Di hola en español chileno'),
        ('mixtral:8x7b', 'Traduce al español: "Wireless headphones"'),  
        ('codellama:34b', 'Lista 3 especificaciones técnicas para auriculares')
    ]
    
    results = {}
    
    for model, prompt in tests:
        success = test_ollama_model(model, prompt, max_tokens=30)
        results[model] = success
        
        if not success:
            print('⚠️ Esperando 5 segundos antes del siguiente modelo...')
            time.sleep(5)
    
    # Resumen final
    print('\n🎯 RESUMEN DE RESULTADOS:')
    print('=' * 30)
    
    for model, success in results.items():
        status = '✅ FUNCIONANDO' if success else '❌ ERROR'
        print(f'{model:<15} | {status}')
    
    total_success = sum(results.values())
    total_models = len(results)
    
    print(f'\n📊 TOTAL: {total_success}/{total_models} modelos funcionando')
    
    if total_success > 0:
        print('\n🎉 ¡AL MENOS UN MODELO PREMIUM ESTÁ FUNCIONANDO!')
        print('🚀 Puedes proceder con el enriquecimiento de productos')
    else:
        print('\n⚠️ Ningún modelo funciona actualmente')
        print('💡 Verifica que Ollama esté corriendo en puerto 11434')

if __name__ == '__main__':
    main()