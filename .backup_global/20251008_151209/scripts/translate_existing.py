import os, time, sys, requests, json
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables desde .env
load_dotenv()
sys.stdout.reconfigure(encoding='utf-8')

# Configuración Supabase
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not url or not key:
    print("[ERROR] Variables de entorno no encontradas. Revisa tu .env")
    sys.exit(1)

supabase: Client = create_client(url, key)

# Configuración Ollama
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3:8b"

def ollama_generate(prompt: str, max_tokens: int = 300) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": MODEL, "prompt": prompt}
        )
        text = ""
        for line in response.iter_lines():
            if line:
                data = json.loads(line.decode("utf-8"))
                if "response" in data:
                    text += data["response"]
        return text.strip()
    except Exception as e:
        print(f"[WARN] Ollama error: {e}")
        return None

# --- Traducción estricta ---
def translate_text(text: str) -> str:
    if not text:
        return None
    prompt = f"Traduce al español este texto, sin inventar nada:\n\n{text}"
    return ollama_generate(prompt)

# --- Generación por categoría ---
def category_style(category: str) -> str:
    mapping = {
        "hogar": "Resalta decoración, calidez y ambiente acogedor.",
        "belleza": "Resalta elegancia, glamour y cuidado personal.",
        "bienestar": "Resalta relajación, salud y energía positiva.",
        "ropa": "Resalta estilo, comodidad y ocasión de uso."
    }
    return mapping.get(category, "Hazlo atractivo y orientado a ventas.")

def generate_long_desc(name: str, category: str = None) -> str:
    prompt = f"""
    Escribe una descripción larga en español (120-150 palabras) para un producto llamado '{name}'.
    {category_style(category)}
    """
    return ollama_generate(prompt, max_tokens=350)

def generate_short_desc(name: str, category: str = None) -> str:
    prompt = f"""
    Genera una descripción corta en español (máx 70 caracteres) para un producto llamado '{name}'.
    {category_style(category)}
    """
    text = ollama_generate(prompt, max_tokens=80)
    if text:
        text = text.strip().strip('"').strip("'")
        return text[:70]
    return None

# --- Procesamiento ---
def process_batch():
    field_map = {
        "name": "name_es",
        "description": "description_es",
        "short_desc": "short_desc_es",
        "long_desc": "long_desc_es",
    }

    select_fields = ["id", "category_slug"] + [f for pair in field_map.items() for f in pair]
    query = supabase.table("products").select(",".join(select_fields))
    or_filters = [f"{tgt}.is.null" for tgt in field_map.values()]
    productos = query.or_(",".join(or_filters)).limit(10).execute().data

    if not productos:
        return False

    for p in productos:
        updates = {}
        cat = p.get("category_slug")

        # Nombre
        if p.get("name") and not p.get("name_es"):
            updates["name_es"] = translate_text(p["name"])
            print(f"[TRANSLATE] name → name_es: {updates['name_es']}")

        # Descripción
        if not p.get("description_es"):
            if p.get("description"):
                updates["description_es"] = translate_text(p["description"])
                print(f"[TRANSLATE] description → description_es")
            else:
                updates["description_es"] = generate_long_desc(
                    updates.get("name_es") or p.get("name_es") or p.get("name"),
                    cat
                )
                print(f"[GENERATE] description_es generado con IA")

        # Short desc
        if not p.get("short_desc_es"):
            name = updates.get("name_es") or p.get("name_es") or p.get("name")
            updates["short_desc_es"] = generate_short_desc(name, cat)
            print(f"[AI] short_desc_es generado: {updates['short_desc_es']}")

        # Long desc
        if not p.get("long_desc_es"):
            name = updates.get("name_es") or p.get("name_es") or p.get("name")
            updates["long_desc_es"] = generate_long_desc(name, cat)
            print(f"[AI] long_desc_es generado.")

        if updates:
            print(f"[UPDATE] ID={p['id']} → {updates}")
            result = supabase.table("products").update(updates).eq("id", p["id"]).execute()
            print(f"[SUPABASE RESPONSE] {result}")
        else:
            print(f"[SKIP] ID={p['id']} no generó updates")

    return True

def main():
    max_loops = 50
    loops = 0
    while loops < max_loops:
        print(f"[SCAN] Iteración {loops+1} buscando productos pendientes...")
        has_more = process_batch()
        if not has_more:
            print("[DONE] No quedan productos pendientes.")
            break
        loops += 1
        time.sleep(2)
    else:
        print("[STOP] Se alcanzó el máximo de iteraciones, revisa filtros o datos.")

if __name__ == "__main__":
    main()