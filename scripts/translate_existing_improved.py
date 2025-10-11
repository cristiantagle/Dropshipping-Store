import os, time, sys, requests, json, argparse, hashlib
from typing import Any, Dict, List, Optional, Tuple
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables desde .env
load_dotenv()
sys.stdout.reconfigure(encoding='utf-8')

# -------------------- CLI y Config --------------------
def parse_args():
    parser = argparse.ArgumentParser(description="Traduce y genera textos faltantes para products.*_es (MEJORADO)")
    parser.add_argument("--dry-run", action="store_true", help="No escribe en DB, solo muestra cambios")
    parser.add_argument("--batch-size", type=int, default=10, help="Tamaño de lote por consulta (default 10)")
    parser.add_argument("--max-loops", type=int, default=50, help="Máximo de iteraciones (default 50)")
    parser.add_argument("--sleep-ms", type=int, default=3000, help="Espera entre lotes en ms (default 3000 - más tiempo para qwen)")
    parser.add_argument("--only", type=str, default="all", help="Campos a procesar: all|name|desc|short|long o lista separada por comas")
    # MODELO MEJORADO: qwen2.5:7b es superior para traducción
    parser.add_argument("--model", type=str, default=os.environ.get("OLLAMA_MODEL", "qwen2.5:7b"))
    parser.add_argument("--ollama-url", type=str, default=os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate"))
    parser.add_argument("--timeout", type=int, default=45, help="Timeout por petición a Ollama (s) - más tiempo para qwen")
    parser.add_argument("--retries", type=int, default=3, help="Reintentos ante error/transient")
    # PARÁMETROS OPTIMIZADOS para qwen2.5:7b
    parser.add_argument("--temperature", type=float, default=0.1)  # Más determinístico para traducción
    parser.add_argument("--top-p", type=float, default=0.85)      # Más enfocado
    return parser.parse_args()

ARGS = parse_args()

# Configuración Supabase
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not url or not key:
    print("[ERROR] Variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas en .env")
    sys.exit(1)

supabase: Client = create_client(url, key)

# -------------------- Caché simple (MANTENIDO) --------------------
CACHE_PATH = os.path.join(os.path.dirname(__file__), f".translate_cache_{ARGS.model.replace(':', '_')}.json")

def _cache_load() -> Dict[str, Any]:
    try:
        if os.path.exists(CACHE_PATH):
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"[WARN] No se pudo leer caché: {e}")
    return {}

def _cache_save(data: Dict[str, Any]):
    try:
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[WARN] No se pudo escribir caché: {e}")

CACHE_DATA = _cache_load()

def _cache_key(kind: str, text: str, model: str, category: Optional[str] = None, extra: str = "") -> str:
    h = hashlib.sha256()
    h.update((kind + "\n" + (category or "") + "\n" + model + "\n" + (extra or "") + "\n" + (text or "")).encode("utf-8"))
    return h.hexdigest()

def cache_get(key: str) -> Optional[str]:
    v = CACHE_DATA.get(key)
    if isinstance(v, str):
        return v
    return None

def cache_set(key: str, value: Optional[str]):
    if value is None:
        return
    CACHE_DATA[key] = value
    _cache_save(CACHE_DATA)

# -------------------- Ollama MEJORADO --------------------
def ollama_generate(prompt: str, max_tokens: int = 300) -> Optional[str]:
    payload = {
        "model": ARGS.model,
        "prompt": prompt,
        "stream": False,  # Más simple para qwen2.5
        "options": {
            "temperature": ARGS.temperature,
            "top_p": ARGS.top_p,
            "num_predict": max_tokens,
            "stop": ["\n\n", "---", "Traducción:", "Translation:"],  # Mejores stop tokens
        },
    }

    last_err = None
    for attempt in range(1, ARGS.retries + 1):
        try:
            print(f"[OLLAMA] Enviando a {ARGS.model} (intento {attempt}/{ARGS.retries})...")
            resp = requests.post(ARGS.ollama_url, json=payload, timeout=ARGS.timeout)
            
            if resp.status_code != 200:
                last_err = f"HTTP {resp.status_code}: {resp.text[:200]}"
                print(f"[WARN] Ollama respuesta no OK: {last_err}")
                time.sleep(min(3 * attempt, 10))  # Más tiempo entre reintentos
                continue

            try:
                data = resp.json()
                text = data.get("response", "").strip()
                
                if text:
                    # LIMPIEZA MEJORADA para qwen2.5:7b
                    text = text.strip()
                    # Remover prefijos comunes
                    prefixes = ["Traducción:", "Translation:", "Respuesta:", "Answer:"]
                    for prefix in prefixes:
                        if text.startswith(prefix):
                            text = text[len(prefix):].strip()
                    
                    # Remover comillas externas
                    text = text.strip('"').strip("'")
                    
                    # Tomar solo la primera línea si hay múltiples
                    text = text.split('\n')[0].strip()
                    
                    if text:
                        print(f"[OLLAMA] ✅ Respuesta obtenida: '{text[:60]}{'...' if len(text) > 60 else ''}'")
                        return text
                
            except json.JSONDecodeError:
                last_err = "Respuesta no es JSON válido"
                print(f"[WARN] {last_err}")
                
        except Exception as e:
            last_err = str(e)
            print(f"[WARN] Ollama error (intento {attempt}/{ARGS.retries}): {last_err}")
            time.sleep(min(3 * attempt, 10))

    print(f"[ERROR] Ollama agotó reintentos: {last_err}")
    return None

# --- PROMPTS MEJORADOS para qwen2.5:7b ---
def translate_text(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    
    # PROMPT MEJORADO específico para qwen2.5:7b
    prompt = f"""Traduce este texto del inglés al español de manera natural y comercial para una tienda online:

"{text}"

INSTRUCCIONES:
- Responde SOLO con la traducción, sin explicaciones
- Usa español latinoamericano natural
- Mantén el sentido comercial atractivo
- No traduzcas nombres de marcas conocidas
- Si hay medidas o especificaciones técnicas, mantenlas

Traducción:"""

    key = _cache_key("translate", text, ARGS.model)
    cached = cache_get(key)
    if cached:
        print(f"[CACHE] ✅ Traducción desde caché: '{cached[:50]}...'")
        return cached
        
    out = ollama_generate(prompt, max_tokens=200)
    if out:
        out = out.strip().strip('"').strip("'")
        cache_set(key, out)
        print(f"[NUEVA] ✅ Traducción generada: '{out[:50]}...'")
    return out

# --- PROMPTS MEJORADOS para generación ---
def category_style(category: Optional[str]) -> str:
    mapping = {
        "hogar": "Enfócate en crear ambientes acogedores, decoración moderna y funcionalidad para el hogar.",
        "belleza": "Resalta la elegancia, el cuidado personal y los beneficios para lucir radiante.",
        "bienestar": "Destaca la relajación, el bienestar físico y mental, y la vida saludable.",
        "eco": "Enfatiza la sostenibilidad, materiales eco-friendly y cuidado del medio ambiente.",
        "mascotas": "Resalta la seguridad, comodidad y bienestar de las mascotas, fortaleciendo el vínculo.",
        "tecnologia": "Destaca la practicidad, innovación y facilidad de uso en la vida cotidiana.",
        "ropa_hombre": "Enfócate en estilo masculino, comodidad y versatilidad para diferentes ocasiones.",
        "ropa_mujer": "Resalta el estilo femenino, la versatilidad y la comodidad sin sacrificar la elegancia.",
        "accesorios": "Destaca el diseño atractivo, la practicidad y cómo complementa el estilo personal.",
    }
    return mapping.get((category or "").lower(), "Hazlo atractivo, claro y orientado a ventas online.")

def generate_long_desc(name: str, category: Optional[str] = None) -> Optional[str]:
    if not name:
        return None
        
    prompt = f"""Escribe una descripción detallada en español para este producto de tienda online:

Producto: "{name}"
Categoría: {category or "general"}

INSTRUCCIONES:
- Escribe 120-150 palabras aproximadamente
- {category_style(category)}
- Usa lenguaje persuasivo y comercial
- Menciona beneficios principales y características destacadas
- No inventes especificaciones técnicas exactas
- Termina con una frase que invite a la compra

Descripción:"""

    key = _cache_key("long", name, ARGS.model, category)
    cached = cache_get(key)
    if cached:
        return cached
        
    out = ollama_generate(prompt, max_tokens=400)
    if out:
        cache_set(key, out)
    return out

def generate_short_desc(name: str, category: Optional[str] = None) -> Optional[str]:
    if not name:
        return None
        
    prompt = f"""Genera una descripción muy corta en español para este producto:

Producto: "{name}"

INSTRUCCIONES:
- Máximo 60-70 caracteres
- {category_style(category)}
- Frase impactante y comercial
- Sin comillas en la respuesta

Descripción corta:"""

    key = _cache_key("short", name, ARGS.model, category)
    cached = cache_get(key)
    if cached:
        return cached[:70]
        
    out = ollama_generate(prompt, max_tokens=50)
    if out:
        out = out.strip().strip('"').strip("'")[:70]
        cache_set(key, out)
    return out

# -------------------- Procesamiento (MANTENIDO) --------------------
FIELD_SOURCES = {
    "name": ("name", "name_es"),
    "desc": ("description", "description_es"),
    "short": ("short_desc", "short_desc_es"),
    "long": ("long_desc", "long_desc_es"),
}

def _normalize_only_arg(value: str) -> List[str]:
    if not value or value == "all":
        return ["name", "desc", "short", "long"]
    parts = [p.strip() for p in value.replace(";", ",").split(",") if p.strip()]
    valid = [p for p in parts if p in FIELD_SOURCES]
    if not valid:
        return ["name", "desc", "short", "long"]
    return valid

def _audit_write(entries: List[Dict[str, Any]]):
    path = os.path.join(os.path.dirname(__file__), f"translate_existing_{ARGS.model.replace(':', '_')}.changes.json")
    existing: List[Dict[str, Any]] = []
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                existing = json.load(f) or []
    except Exception:
        existing = []
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(existing + entries, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[WARN] No se pudo escribir auditoría: {e}")

def process_batch(batch_size: int, only_fields: List[str], dry_run: bool) -> bool:
    # Construir consulta select (MANTENIDO)
    targets = [FIELD_SOURCES[k][1] for k in only_fields]
    sources = [FIELD_SOURCES[k][0] for k in only_fields]
    base_text_fields = ["name", "name_es"]
    select_fields = ["id", "category_slug"] + list({*targets, *sources, *base_text_fields})

    query = supabase.table("products").select(",".join(select_fields))
    # Considerar nulos y cadenas vacías como pendientes
    or_terms: List[str] = []
    for t in targets:
        or_terms.append(f"{t}.is.null")
        or_terms.append(f"{t}.eq.")
    productos = query.or_(",".join(or_terms)).limit(batch_size).execute().data

    if not productos:
        return False

    print(f"[BATCH] Procesando {len(productos)} productos...")
    audit_entries: List[Dict[str, Any]] = []

    for i, p in enumerate(productos):
        print(f"\n[{i+1}/{len(productos)}] Procesando ID: {p['id']}")
        updates: Dict[str, Any] = {}
        cat = p.get("category_slug")

        # NAME
        if "name" in only_fields and p.get("name") and not p.get("name_es"):
            print(f"[TRANSLATE] Traduciendo nombre: '{p.get('name')[:50]}...'")
            new_name_es = translate_text(p.get("name"))
            if new_name_es:
                updates["name_es"] = new_name_es

        # DESCRIPTION
        if "desc" in only_fields and not p.get("description_es"):
            src_desc = p.get("description")
            if src_desc:
                print(f"[TRANSLATE] Traduciendo descripción...")
                new_desc_es = translate_text(src_desc)
                if new_desc_es:
                    updates["description_es"] = new_desc_es
            else:
                base_name = updates.get("name_es") or p.get("name_es") or p.get("name")
                print(f"[GENERATE] Generando descripción para: '{base_name}'")
                gen_desc = generate_long_desc(base_name, cat)
                if gen_desc:
                    updates["description_es"] = gen_desc

        # SHORT DESC
        if "short" in only_fields and not p.get("short_desc_es"):
            base_name = updates.get("name_es") or p.get("name_es") or p.get("name")
            print(f"[AI] Generando descripción corta para: '{base_name}'")
            gen_short = generate_short_desc(base_name, cat)
            if gen_short:
                updates["short_desc_es"] = gen_short

        # LONG DESC
        if "long" in only_fields and not p.get("long_desc_es"):
            base_name = updates.get("name_es") or p.get("name_es") or p.get("name")
            print(f"[AI] Generando descripción larga para: '{base_name}'")
            gen_long = generate_long_desc(base_name, cat)
            if gen_long:
                updates["long_desc_es"] = gen_long

        if updates:
            audit_entries.extend([
                {
                    "id": p["id"],
                    "campo": k,
                    "antes": p.get(k),
                    "despues": v,
                    "ts": int(time.time()),
                    "model": ARGS.model,
                }
                for k, v in updates.items()
            ])

            if dry_run:
                print(f"[DRY-RUN] ID={p['id']} → {updates}")
            else:
                try:
                    result = (
                        supabase.table("products").update(updates).eq("id", p["id"]).execute()
                    )
                    print(f"[UPDATE] ✅ ID={p['id']} aplicado exitosamente.")
                except Exception as e:
                    print(f"[ERROR] ❌ Falló update ID={p['id']}: {e}")
        else:
            print(f"[SKIP] ID={p['id']} sin cambios necesarios")

    # Escribir auditoría siempre (incluye dry-run para revisión)
    if audit_entries:
        _audit_write(audit_entries)
        print(f"\n[AUDIT] ✅ {len(audit_entries)} cambios registrados en auditoría")

    return True

def main():
    print(f"🚀 TRADUCTOR MEJORADO - Modelo: {ARGS.model}")
    print(f"📁 Caché: {os.path.basename(CACHE_PATH)}")
    print(f"🔧 Configuración: batch_size={ARGS.batch_size}, timeout={ARGS.timeout}s, temp={ARGS.temperature}")
    print()
    
    only_fields = _normalize_only_arg(ARGS.only)
    print(f"📋 Campos a procesar: {only_fields}")
    if ARGS.dry_run:
        print("🧪 MODO DRY-RUN: No se escribirá en la base de datos")
    print()
    
    loops = 0
    total_processed = 0
    
    while loops < ARGS.max_loops:
        print(f"[SCAN] 🔍 Iteración {loops+1}/{ARGS.max_loops} - Buscando productos pendientes...")
        has_more = process_batch(ARGS.batch_size, only_fields, ARGS.dry_run)
        
        if not has_more:
            print("\n[DONE] ✅ No quedan productos pendientes para procesar.")
            break
            
        loops += 1
        total_processed += ARGS.batch_size
        
        if loops < ARGS.max_loops:
            sleep_seconds = max(0, ARGS.sleep_ms) / 1000.0
            print(f"\n[WAIT] ⏳ Esperando {sleep_seconds}s antes del siguiente lote...")
            time.sleep(sleep_seconds)
    else:
        print(f"\n[STOP] ⚠️ Se alcanzó el máximo de iteraciones ({ARGS.max_loops})")
        print("Revisa los filtros o aumenta --max-loops si hay más productos pendientes.")
    
    print(f"\n🎉 Proceso completado. Lotes procesados: {loops}")
    print(f"📊 Cache utilizado: {os.path.basename(CACHE_PATH)}")

if __name__ == "__main__":
    main()