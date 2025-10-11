import os, requests, json, time
from dotenv import load_dotenv

load_dotenv()

# Configuración
OLLAMA_URL = "http://localhost:11434/api/generate"
TIMEOUT = 30

def test_model(model: str, text: str, context: str = "product_name") -> str:
    """Prueba un modelo específico con un texto"""
    
    if context == "product_name":
        prompt = f"""Traduce este texto del inglés al español de manera natural y comercial para una tienda online:

"{text}"

INSTRUCCIONES:
- Responde SOLO con la traducción, sin explicaciones
- Usa español latinoamericano natural
- Mantén el sentido comercial atractivo
- No traduzcas nombres de marcas conocidas

Traducción:"""
    else:  # description
        prompt = f"""Traduce esta descripción del inglés al español para una tienda online:

"{text}"

INSTRUCCIONES:
- Mantén el tono comercial y atractivo
- Usa español natural y fluido
- Conserva el sentido original

Traducción:"""

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "top_p": 0.85,
            "num_predict": 200,
        },
    }

    try:
        print(f"  🔄 Probando {model}...")
        resp = requests.post(OLLAMA_URL, json=payload, timeout=TIMEOUT)
        
        if resp.status_code == 200:
            data = resp.json()
            translation = data.get("response", "").strip()
            
            # Limpiar respuesta
            prefixes = ["Traducción:", "Translation:", "Respuesta:"]
            for prefix in prefixes:
                if translation.startswith(prefix):
                    translation = translation[len(prefix):].strip()
            
            translation = translation.strip('"').strip("'").split('\n')[0].strip()
            return translation
        else:
            return f"ERROR: HTTP {resp.status_code}"
            
    except Exception as e:
        return f"ERROR: {str(e)}"

def main():
    print("🧪 COMPARACIÓN DE MODELOS PARA TRADUCCIÓN")
    print("="*50)
    print()
    
    # Modelos a comparar
    models = ["llama3:8b", "qwen2.5:7b", "gemma2:9b", "mistral-nemo:12b"]
    
    # Textos de prueba (reales de tu BD)
    test_cases = [
        {
            "text": "Women's Loose And Lazy Style Love Sweater Cardigan",
            "context": "product_name",
            "type": "📱 Nombre de producto"
        },
        {
            "text": "Small Night Lamp Glass Ball Small Ornaments Birthday Gift",
            "context": "product_name", 
            "type": "📱 Nombre de producto"
        },
        {
            "text": "Vintage Brown Lapel Men's Leather Overcoat Jacket",
            "context": "product_name",
            "type": "📱 Nombre de producto"
        },
        {
            "text": "This elegant sweater combines comfort with style, perfect for casual outings or cozy nights at home. Made with high-quality materials.",
            "context": "description",
            "type": "📝 Descripción"
        }
    ]
    
    # Verificar qué modelos están disponibles
    try:
        resp = requests.get("http://localhost:11434/api/tags", timeout=10)
        if resp.status_code == 200:
            available_models = [m["name"] for m in resp.json().get("models", [])]
            print(f"📦 Modelos disponibles: {', '.join(available_models)}")
            models = [m for m in models if m in available_models]
            if not models:
                print("❌ No hay modelos de traducción instalados")
                return
        else:
            print("⚠️ No se pudo verificar modelos disponibles, intentando con la lista completa...")
    except:
        print("⚠️ No se pudo conectar con Ollama, intentando con la lista completa...")
    
    print(f"🎯 Probando con modelos: {', '.join(models)}")
    print()
    
    # Realizar comparaciones
    for i, test_case in enumerate(test_cases):
        print(f"{i+1}. {test_case['type']}")
        print(f"   📋 Original: \"{test_case['text']}\"")
        print()
        
        results = {}
        for model in models:
            result = test_model(model, test_case['text'], test_case['context'])
            results[model] = result
            print(f"   {model:15} → \"{result}\"")
            time.sleep(1)  # Pausa entre modelos
        
        print()
        print("-" * 60)
        print()
    
    print("🎯 RECOMENDACIÓN:")
    print()
    print("📊 Para tu caso de uso (tienda online):")
    print("   🥇 qwen2.5:7b  - Mejor para traducción, más natural")
    print("   🥈 gemma2:9b   - Muy bueno para textos comerciales") 
    print("   🥉 llama3:8b   - Sólido, tu modelo actual")
    print()
    print("💡 Para usar el modelo mejorado:")
    print("   ollama pull qwen2.5:7b")
    print("   python scripts/translate_existing_improved.py --model qwen2.5:7b --dry-run")

if __name__ == "__main__":
    main()