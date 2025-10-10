import os, time, sys, requests, json, argparse, hashlib
from typing import Any, Dict, List, Optional, Tuple
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables desde .env
load_dotenv()
sys.stdout.reconfigure(encoding='utf-8')

# -------------------- CLI y Config --------------------
def parse_args():
    parser = argparse.ArgumentParser(description="Traduce y genera textos faltantes para products.*_es")
    parser.add_argument("--dry-run", action="store_true", help="No escribe en DB, solo muestra cambios")
    parser.add_argument("--batch-size", type=int, default=10, help="Tamaño de lote por consulta (default 10)")
    parser.add_argument("--max-loops", type=int, default=50, help="Máximo de iteraciones (default 50)")
    parser.add_argument("--sleep-ms", type=int, default=2000, help="Espera entre lotes en ms (default 2000)")
    parser.add_argument("--only", type=str, default="all", help="Campos a procesar: all|name|desc|short|long o lista separada por comas")
    parser.add_argument("--model", type=str, default=os.environ.get("OLLAMA_MODEL", "llama3:8b"))
    parser.add_argument("--ollama-url", type=str, default=os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate"))
    parser.add_argument("--timeout", type=int, default=30, help="Timeout por petición a Ollama (s)")
    parser.add_argument("--retries", type=int, default=3, help="Reintentos ante error/transient")
    parser.add_argument("--temperature", type=float, default=0.2)
    parser.add_argument("--top-p", type=float, default=0.9)
    return parser.parse_args()

ARGS = parse_args()

# Configuración Supabase
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not url or not key:
    print("[ERROR] Variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas en .env")
    sys.exit(1)

supabase: Client = create_client(url, key)

# -------------------- Caché simple --------------------
CACHE_PATH = os.path.join(os.path.dirname(__file__), ".translate_cache.json")

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

# -------------------- Ollama --------------------
def ollama_generate(prompt: str, max_tokens: int = 300) -> Optional[str]:
    payload = {
        "model": ARGS.model,
        "prompt": prompt,
        # Por compatibilidad con generate streaming NDJSON
        "options": {
            "temperature": ARGS.temperature,
            "top_p": ARGS.top_p,
            "num_predict": max_tokens,
        },
    }

    last_err = None
    for attempt in range(1, ARGS.retries + 1):
        try:
            resp = requests.post(ARGS.ollama_url, json=payload, timeout=ARGS.timeout)
            if resp.status_code != 200:
                last_err = f"HTTP {resp.status_code}: {resp.text[:200]}"
                print(f"[WARN] Ollama respuesta no OK (intento {attempt}/{ARGS.retries}): {last_err}")
                time.sleep(min(2 * attempt, 5))
                continue

            text = ""
            for line in resp.iter_lines():
                if not line:
                    continue
                try:
                    data = json.loads(line.decode("utf-8"))
                except Exception:
                    # Puede venir bloque completo si stream=false en servidor
                    try:
                        data = resp.json()
                    except Exception:
                        data = {}
                chunk = data.get("response") if isinstance(data, dict) else None
                if chunk:
                    text += chunk
            return text.strip() if text else None
        except Exception as e:
            last_err = str(e)
            print(f"[WARN] Ollama error (intento {attempt}/{ARGS.retries}): {last_err}")
            time.sleep(min(2 * attempt, 5))

    print(f"[ERROR] Ollama agotó reintentos: {last_err}")
    return None

# --- Traducción estricta con caché ---
def translate_text(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    prompt = f"Traduce al español este texto, sin inventar ni resumir, conserva marcas y unidades cuando existan.\n\n{text}"
    key = _cache_key("translate", text, ARGS.model)
    cached = cache_get(key)
    if cached:
        return cached
    out = ollama_generate(prompt, max_tokens=280)
    if out:
        out = out.strip().strip('"').strip("'")
        cache_set(key, out)
    return out

# --- Estilos por categoría extendidos ---
def category_style(category: Optional[str]) -> str:
    mapping = {
        "hogar": "Resalta decoración, calidez, orden y ambiente acogedor.",
        "belleza": "Resalta elegancia, glamour y cuidado personal consciente.",
        "bienestar": "Resalta relajación, salud y energía positiva.",
        "eco": "Resalta sostenibilidad, materiales reutilizables y bajo impacto ambiental.",
        "mascotas": "Resalta seguridad, comodidad y vínculo con tu mascota.",
        "tecnologia": "Resalta utilidad, portabilidad y facilidad de uso sin tecnicismos.",
        "ropa_hombre": "Resalta estilo masculino, comodidad y ocasión de uso.",
        "ropa_mujer": "Resalta estilo, versatilidad y confort.",
        "accesorios": "Resalta practicidad y diseño atractivo.",
    }
    return mapping.get((category or "").lower(), "Hazlo atractivo, claro y orientado a ventas.")

def generate_long_desc(name: str, category: Optional[str] = None) -> Optional[str]:
    if not name:
        return None
    prompt = (
        f"Escribe una descripción larga en español (120-150 palabras) para un producto llamado '{name}'.\n"
        f"{category_style(category)}\n"
        "Evita promesas médicas, no inventes certificaciones ni datos técnicos inexistentes."
    )
    key = _cache_key("long", name, ARGS.model, category)
    cached = cache_get(key)
    if cached:
        return cached
    out = ollama_generate(prompt, max_tokens=380)
    if out:
        cache_set(key, out)
    return out

def generate_short_desc(name: str, category: Optional[str] = None) -> Optional[str]:
    if not name:
        return None
    prompt = (
        f"Genera una descripción corta en español (máx 70 caracteres) para '{name}'.\n"
        f"{category_style(category)}\n"
        "Devuelve solo el texto sin comillas."
    )
    key = _cache_key("short", name, ARGS.model, category)
    cached = cache_get(key)
    if cached:
        return cached[:70]
    out = ollama_generate(prompt, max_tokens=90)
    if out:
        out = out.strip().strip('"').strip("'")[:70]
        cache_set(key, out)
    return out

# -------------------- Procesamiento --------------------
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
    path = os.path.join(os.path.dirname(__file__), "translate_existing.changes.json")
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
    # Construir consulta select
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

    audit_entries: List[Dict[str, Any]] = []

    for p in productos:
        updates: Dict[str, Any] = {}
        cat = p.get("category_slug")

        # NAME
        if "name" in only_fields and p.get("name") and not p.get("name_es"):
            new_name_es = translate_text(p.get("name"))
            if new_name_es:
                updates["name_es"] = new_name_es
                print(f"[TRANSLATE] name → name_es: {new_name_es}")

        # DESCRIPTION
        if "desc" in only_fields and not p.get("description_es"):
            src_desc = p.get("description")
            if src_desc:
                new_desc_es = translate_text(src_desc)
                if new_desc_es:
                    updates["description_es"] = new_desc_es
                print("[TRANSLATE] description → description_es")
            else:
                base_name = updates.get("name_es") or p.get("name_es") or p.get("name")
                gen_desc = generate_long_desc(base_name, cat)
                if gen_desc:
                    updates["description_es"] = gen_desc
                print("[GENERATE] description_es generado con IA")

        # SHORT DESC
        if "short" in only_fields and not p.get("short_desc_es"):
            base_name = updates.get("name_es") or p.get("name_es") or p.get("name")
            gen_short = generate_short_desc(base_name, cat)
            if gen_short:
                updates["short_desc_es"] = gen_short
            print(f"[AI] short_desc_es generado: {updates.get('short_desc_es')}")

        # LONG DESC
        if "long" in only_fields and not p.get("long_desc_es"):
            base_name = updates.get("name_es") or p.get("name_es") or p.get("name")
            gen_long = generate_long_desc(base_name, cat)
            if gen_long:
                updates["long_desc_es"] = gen_long
            print("[AI] long_desc_es generado.")

        if updates:
            audit_entries.extend([
                {
                    "id": p["id"],
                    "campo": k,
                    "antes": p.get(k),
                    "despues": v,
                    "ts": int(time.time()),
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
                    print(f"[UPDATE] ID={p['id']} aplicado. Respuesta: {getattr(result, 'data', None)}")
                except Exception as e:
                    print(f"[ERROR] Falló update ID={p['id']}: {e}")
        else:
            print(f"[SKIP] ID={p['id']} sin cambios")

    # Escribir auditoría siempre (incluye dry-run para revisión)
    if audit_entries:
        _audit_write(audit_entries)

    return True

def main():
    only_fields = _normalize_only_arg(ARGS.only)
    loops = 0
    while loops < ARGS.max_loops:
        print(f"[SCAN] Iteración {loops+1} buscando productos pendientes ({only_fields})…")
        has_more = process_batch(ARGS.batch_size, only_fields, ARGS.dry_run)
        if not has_more:
            print("[DONE] No quedan productos pendientes.")
            break
        loops += 1
        time.sleep(max(0, ARGS.sleep_ms) / 1000.0)
    else:
        print("[STOP] Se alcanzó el máximo de iteraciones, revisa filtros o datos.")

if __name__ == "__main__":
    main()
