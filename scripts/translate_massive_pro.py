#!/usr/bin/env python3
"""
🔥 TRADUCTOR MASIVO PRO - OPTIMIZADO PARA PC POTENTE (64GB RAM)
Sistema definitivo para traducir TODA la base de datos con modelos premium

Características:
- Llama3:70B para traducciones de máxima calidad
- Mixtral:8x7b como especialista en español chileno
- Sistema multi-modelo inteligente con fallbacks
- Procesamiento masivo optimizado
- Cache persistente por modelo
- Estadísticas detalladas y progreso visual
- Sistema de recuperación ante fallos
"""

import os, time, sys, requests, json, argparse, hashlib
import threading, queue, signal
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables desde .env
load_dotenv()
sys.stdout.reconfigure(encoding='utf-8')

@dataclass 
class TranslationStats:
    """Estadísticas del proceso de traducción"""
    total_products: int = 0
    processed: int = 0
    translated: int = 0
    from_cache: int = 0
    errors: int = 0
    start_time: datetime = None
    
    def __post_init__(self):
        if self.start_time is None:
            self.start_time = datetime.now()
    
    def elapsed_time(self) -> str:
        elapsed = datetime.now() - self.start_time
        minutes, seconds = divmod(elapsed.total_seconds(), 60)
        return f"{int(minutes):02d}:{int(seconds):02d}"
    
    def progress_percent(self) -> float:
        return (self.processed / self.total_products * 100) if self.total_products > 0 else 0
    
    def eta_minutes(self) -> int:
        if self.processed == 0:
            return 0
        elapsed_mins = (datetime.now() - self.start_time).total_seconds() / 60
        rate = self.processed / elapsed_mins
        remaining = self.total_products - self.processed
        return int(remaining / rate) if rate > 0 else 0

# -------------------- CLI y Config --------------------
def parse_args():
    parser = argparse.ArgumentParser(
        description="🔥 TRADUCTOR MASIVO PRO - Sistema definitivo para PC potente",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
EJEMPLOS DE USO:

🚀 Traducción masiva completa (recomendado):
  python scripts/translate_massive_pro.py --limit 1000 --batch-size 20

🎯 Solo campos específicos:
  python scripts/translate_massive_pro.py --only name,desc --limit 500

🧪 Modo prueba (sin escribir BD):
  python scripts/translate_massive_pro.py --dry-run --limit 10

⚡ PC súper potente (batches grandes):
  python scripts/translate_massive_pro.py --batch-size 50 --concurrent 4

🔧 Modelo específico:
  python scripts/translate_massive_pro.py --model mixtral:8x7b --timeout 120
        """
    )
    
    # Parámetros principales
    parser.add_argument("--limit", type=int, default=0, 
                       help="Productos a procesar (0 = todos los pendientes)")
    parser.add_argument("--batch-size", type=int, default=15,
                       help="Productos por lote (recomendado: 15-25)")
    parser.add_argument("--concurrent", type=int, default=2,
                       help="Traducciones concurrentes (máximo recomendado: 4)")
    
    # Control de campos
    parser.add_argument("--only", type=str, default="all",
                       help="Campos: all|name|desc|short|long o lista separada por comas")
    parser.add_argument("--force-retranslate", action="store_true",
                       help="Re-traducir incluso si ya existen traducciones")
    
    # Modelos IA
    parser.add_argument("--model", type=str, 
                       default=os.environ.get("OLLAMA_MODEL", "llama3:70b"),
                       help="Modelo principal (llama3:70b recomendado para PC potente)")
    parser.add_argument("--fallback-model", type=str,
                       default=os.environ.get("OLLAMA_TRANSLATION_MODEL", "mixtral:8x7b"),
                       help="Modelo de respaldo")
    parser.add_argument("--fast-model", type=str, default="llama3:8b",
                       help="Modelo rápido para descripciones cortas")
    
    # Configuración avanzada
    parser.add_argument("--ollama-url", type=str,
                       default=os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate"))
    parser.add_argument("--timeout", type=int, default=90,
                       help="Timeout por traducción (recomendado: 90-120s para modelos grandes)")
    parser.add_argument("--retries", type=int, default=2,
                       help="Reintentos por error")
    parser.add_argument("--sleep-ms", type=int, default=1500,
                       help="Pausa entre lotes en ms")
    
    # Modo y debug
    parser.add_argument("--dry-run", action="store_true",
                       help="Solo mostrar, no escribir en BD")
    parser.add_argument("--verbose", action="store_true",
                       help="Logging detallado")
    parser.add_argument("--stats-interval", type=int, default=10,
                       help="Mostrar estadísticas cada N productos")
    
    return parser.parse_args()

ARGS = parse_args()

# Variables globales
stats = TranslationStats()
stop_requested = False

# Configuración Supabase
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not url or not key:
    print("❌ [ERROR] Variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas")
    sys.exit(1)

supabase: Client = create_client(url, key)

# -------------------- Sistema de Caché Avanzado --------------------
def get_cache_path(model: str) -> str:
    """Obtener ruta de caché específica por modelo"""
    clean_model = model.replace(':', '_').replace('/', '_')
    return os.path.join(os.path.dirname(__file__), f".translate_cache_pro_{clean_model}.json")

def load_cache(model: str) -> Dict[str, Any]:
    """Cargar caché específico del modelo"""
    cache_path = get_cache_path(model)
    try:
        if os.path.exists(cache_path):
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        if ARGS.verbose:
            print(f"[WARN] Error cargando caché {model}: {e}")
    return {}

def save_cache(model: str, cache_data: Dict[str, Any]):
    """Guardar caché específico del modelo"""
    cache_path = get_cache_path(model)
    try:
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        if ARGS.verbose:
            print(f"[WARN] Error guardando caché {model}: {e}")

def cache_key(kind: str, text: str, model: str, category: str = "") -> str:
    """Generar clave de caché única"""
    h = hashlib.sha256()
    content = f"{kind}\n{category}\n{model}\n{text}"
    h.update(content.encode("utf-8"))
    return h.hexdigest()

# -------------------- Sistema de Traducción Multi-Modelo --------------------
class ModelManager:
    """Gestor inteligente de modelos con fallbacks automáticos"""
    
    def __init__(self):
        self.caches = {}
        self.model_priorities = [
            ARGS.model,           # Modelo principal (llama3:70b)
            ARGS.fallback_model,  # Modelo de respaldo (mixtral:8x7b) 
            ARGS.fast_model,      # Modelo rápido (llama3:8b)
        ]
        
        # Cargar todos los caches
        for model in set(self.model_priorities):
            self.caches[model] = load_cache(model)
    
    def get_from_cache(self, key: str, model: str) -> Optional[str]:
        """Buscar en caché, con fallback a otros modelos si es similar"""
        if model in self.caches and key in self.caches[model]:
            return self.caches[model][key]
        return None
    
    def save_to_cache(self, key: str, value: str, model: str):
        """Guardar en caché del modelo específico"""
        if model not in self.caches:
            self.caches[model] = {}
        
        self.caches[model][key] = value
        
        # Guardar cada 10 entradas para no perder progreso
        if len(self.caches[model]) % 10 == 0:
            save_cache(model, self.caches[model])
    
    def translate_with_fallback(self, text: str, context: str = "general") -> Tuple[Optional[str], str]:
        """Traducir con sistema de fallback automático"""
        key = cache_key("translate", text, "any", context)
        
        # 1. Verificar caché de cualquier modelo
        for model in self.model_priorities:
            cached = self.get_from_cache(key, model)
            if cached:
                stats.from_cache += 1
                if ARGS.verbose:
                    print(f"[CACHE] {model}: '{cached[:40]}...'")
                return cached, f"{model}(cache)"
        
        # 2. Intentar traducir con cada modelo en orden de prioridad
        for i, model in enumerate(self.model_priorities):
            try:
                # Ajustar timeout según modelo
                timeout = ARGS.timeout
                if "70b" in model:
                    timeout = max(120, timeout)
                elif "8x7b" in model:
                    timeout = max(90, timeout)
                
                result = self._call_model(text, model, timeout, context)
                if result:
                    # Guardar en caché del modelo que funcionó
                    self.save_to_cache(key, result, model)
                    priority_suffix = "👑" if i == 0 else f"({i+1}°)"
                    return result, f"{model}{priority_suffix}"
                    
            except Exception as e:
                if ARGS.verbose:
                    print(f"[WARN] Modelo {model} falló: {e}")
                continue
        
        # 3. No se pudo traducir con ningún modelo
        return None, "FAILED"

    def generate_with_fallback(self, prompt: str, context: str = "generation") -> Tuple[Optional[str], str]:
        """Generar texto (descripciones) intentando fast_model y con fallback a modelos más grandes.

        Devuelve (resultado, modelo_usado)
        """
        # Generar una clave de caché basada en el prompt y tipo
        key = cache_key("generate", prompt, "any", context)
        # Orden explícito: usar modelo principal (más grande) primero, luego fallback y finalmente el fast_model
        prefer_order = [ARGS.model, ARGS.fallback_model, ARGS.fast_model]

        # 1) Revisar caché por modelo en prefer_order
        for model in prefer_order:
            cached = self.get_from_cache(key, model)
            if cached:
                stats.from_cache += 1
                if ARGS.verbose:
                    print(f"[CACHE] {model}: '{cached[:60]}...'")
                return cached, f"{model}(cache)"

        # 2) Intentar generar con cada modelo en prefer_order
        for i, model in enumerate(prefer_order):
            try:
                timeout = ARGS.timeout
                # Modelos grandes necesitan más tiempo
                if "70b" in model:
                    timeout = max(120, timeout)
                elif "8x7b" in model:
                    timeout = max(90, timeout)
                elif model == ARGS.fast_model:
                    timeout = min(60, timeout)

                if ARGS.verbose:
                    print(f"  [GEN] Intentando generar con {model} (timeout={timeout}s)")

                result = self._call_model(prompt, model, timeout, context)
                if result:
                    # Guardar en caché del modelo que funcionó
                    self.save_to_cache(key, result, model)
                    priority_suffix = "👑" if model == ARGS.model else ("(fast)" if model == ARGS.fast_model else "(fallback)")
                    return result, f"{model}{priority_suffix}"

            except Exception as e:
                # No matar el proceso por fallo de un modelo
                if ARGS.verbose:
                    print(f"[WARN] Generación con {model} falló: {e}")
                continue

        return None, "FAILED"
    
    def _call_model(self, text: str, model: str, timeout: int, context: str) -> Optional[str]:
        """Llamar a un modelo específico"""
        
        # Prompts optimizados por modelo
        if "mixtral" in model.lower():
            # Mixtral es especialista en español
            prompt = f"""Traduce del inglés al español chileno natural:

"{text}"

Instrucciones específicas:
- Español chileno natural y comercial
- Mantén el sentido atractivo para tienda online
- Solo la traducción, sin explicaciones
- No traduzcas marcas conocidas

Traducción:"""
        
        elif "70b" in model:
            # Llama3:70b puede manejar contexto más complejo
            prompt = f"""Como experto traductor comercial, traduce este texto de producto al español:

Texto original: "{text}"
Contexto: {context}

Requisitos:
- Español latinoamericano natural
- Tono comercial atractivo para e-commerce
- Mantener nombres de marcas en inglés
- Respuesta directa sin explicaciones

Traducción final:"""
        
        else:
            # Prompt estándar para otros modelos
            prompt = f"""Traduce al español de manera natural y comercial:

"{text}"

Solo devuelve la traducción, sin explicaciones."""
        
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1 if "translate" in context else 0.3,
                "top_p": 0.85,
                "num_predict": 150,
                "stop": ["\\n\\n", "Traducción:", "Translation:", "Original:"]
            }
        }
        
        response = requests.post(ARGS.ollama_url, json=payload, timeout=timeout)
        
        if response.status_code == 200:
            data = response.json()
            result = data.get("response", "").strip()
            
            # Limpiar respuesta
            result = self._clean_response(result)
            
            if result and len(result) > 3:  # Mínimo 3 caracteres
                return result
        
        return None
    
    def _clean_response(self, text: str) -> str:
        """Limpiar respuesta del modelo"""
        # Remover prefijos comunes
        prefixes = ["Traducción:", "Translation:", "Respuesta:", "Answer:", 
                   "Resultado:", "Final:", "Español:", "Spanish:"]
        
        for prefix in prefixes:
            if text.startswith(prefix):
                text = text[len(prefix):].strip()
        
        # Remover comillas externas
        text = text.strip('"').strip("'")
        
        # Solo la primera línea si hay múltiples
        text = text.split('\n')[0].strip()
        
        return text
    
    def finalize_caches(self):
        """Guardar todos los caches al final del proceso"""
        for model, cache_data in self.caches.items():
            if cache_data:  # Solo si hay datos
                save_cache(model, cache_data)
                if ARGS.verbose:
                    print(f"[CACHE] Guardadas {len(cache_data)} traducciones para {model}")

# -------------------- Procesamiento de Productos --------------------
def get_pending_products(limit: int = 0, only_fields: List[str] = None) -> List[Dict]:
    """Obtener productos que necesitan traducción"""
    
    # Campos a consultar
    base_fields = ["id", "name", "name_es", "description", "description_es", 
                   "short_desc_es", "long_desc_es", "category_slug"]
    # Hacer una selección amplia y filtrar localmente para evitar errores en la
    # construcción de filtros complejos en la URL (postgrest) que podían omitir
    # campos o usar '.eq.' mal formado.
    query = supabase.table("products").select(",".join(base_fields))

    # Aplicar límite seguro en la consulta (si limit==0, traer hasta 5000)
    if limit > 0:
        query = query.limit(limit)
    else:
        query = query.limit(5000)

    response = query.execute()
    rows = response.data or []

    # Filtrar en Python según los campos solicitados
    field_map = {
        "name": "name_es",
        "desc": "description_es",
        "short": "short_desc_es",
        "long": "long_desc_es"
    }

    pending: List[Dict] = []

    for row in rows:
        include = False

        if ARGS.force_retranslate:
            include = True
        else:
            # Determinar si alguno de los campos requeridos está ausente o vacío
            for field in (only_fields or ["name", "desc", "short", "long"]):
                target = field_map.get(field)
                if not target:
                    continue

                val = row.get(target)
                # Considerar nulos y cadenas vacías como faltantes
                if val is None or (isinstance(val, str) and val.strip() == ""):
                    include = True
                    break

        if include:
            pending.append(row)

    print(f"📦 Productos encontrados: {len(pending)}")
    if not ARGS.force_retranslate:
        print("🔍 Solo productos con campos faltantes (nulos o vacíos)")

    return pending

def process_product_batch(products: List[Dict], model_manager: ModelManager, 
                         only_fields: List[str]) -> int:
    """Procesar un lote de productos"""
    success_count = 0
    
    for i, product in enumerate(products):
        if stop_requested:
            print("\n⚠️ Proceso interrumpido por usuario")
            break
            
        product_id = product["id"]
        product_name = product.get("name_es") or product.get("name", "")
        
        print(f"\n[{stats.processed + 1}] 🔄 {product_name[:50]}...")
        
        updates = {}
        
        # NAME - Solo traducir, no generar
        if "name" in only_fields and product.get("name") and (
            ARGS.force_retranslate or not product.get("name_es")
        ):
            print("  📝 Traduciendo nombre...")
            translation, model_used = model_manager.translate_with_fallback(
                product["name"], "product_name"
            )
            if translation:
                updates["name_es"] = translation
                print(f"    ✅ {model_used}: '{translation}'")
                stats.translated += 1
            else:
                print("    ❌ Error traduciendo nombre")
                stats.errors += 1
        
        # DESCRIPTION - Traducir si existe, generar si no
        if "desc" in only_fields and (
            ARGS.force_retranslate or not product.get("description_es")
        ):
            if product.get("description"):
                print("  📝 Traduciendo descripción...")
                translation, model_used = model_manager.translate_with_fallback(
                    product["description"], "description"
                )
                if translation:
                    updates["description_es"] = translation
                    print(f"    ✅ {model_used}")
                    stats.translated += 1
            else:
                # Generar descripción si no existe original
                print("  🎨 Generando descripción...")
                base_name = updates.get("name_es") or product.get("name_es") or product.get("name")
                generated = generate_description(base_name, product.get("category_slug"), model_manager)
                if generated:
                    updates["description_es"] = generated
                    print("    ✅ Descripción generada")
                    stats.translated += 1
        
        # SHORT DESC - Siempre generar
        if "short" in only_fields and (
            ARGS.force_retranslate or not product.get("short_desc_es")
        ):
            print("  🎯 Generando descripción corta...")
            base_name = updates.get("name_es") or product.get("name_es") or product.get("name")
            short_desc = generate_short_description(base_name, product.get("category_slug"), model_manager)
            if short_desc:
                updates["short_desc_es"] = short_desc
                print(f"    ✅ '{short_desc}'")
                stats.translated += 1
        
        # LONG DESC - Siempre generar
        if "long" in only_fields and (
            ARGS.force_retranslate or not product.get("long_desc_es")
        ):
            print("  📄 Generando descripción larga...")
            base_name = updates.get("name_es") or product.get("name_es") or product.get("name")
            long_desc = generate_description(base_name, product.get("category_slug"), model_manager, long=True)
            if long_desc:
                updates["long_desc_es"] = long_desc
                print("    ✅ Descripción larga generada")
                stats.translated += 1
        
        # Aplicar updates
        if updates:
            if not ARGS.dry_run:
                try:
                    supabase.table("products").update(updates).eq("id", product_id).execute()
                    print(f"  💾 Guardado en BD: {len(updates)} campos")
                    success_count += 1
                except Exception as e:
                    print(f"  ❌ Error guardando: {e}")
                    stats.errors += 1
            else:
                print(f"  🧪 DRY-RUN: {len(updates)} campos listos")
                success_count += 1
        else:
            print("  ⏭️ Sin cambios necesarios")
        
        stats.processed += 1
        
        # Mostrar estadísticas periódicamente
        if stats.processed % ARGS.stats_interval == 0:
            show_progress()
    
    return success_count

def generate_description(name: str, category: str, model_manager: ModelManager, long: bool = False) -> Optional[str]:
    """Generar descripción usando IA"""
    if not name:
        return None
    
    length = "150-200 palabras" if long else "80-100 palabras"
    style = get_category_style(category)
    
    prompt = f"""Escribe una descripción comercial en español para esta tienda online:

Producto: "{name}"
Categoría: {category or 'general'}

Instrucciones:
- {length} aproximadamente
- {style}
- Lenguaje comercial atractivo
- Beneficios y características principales
- No inventes especificaciones técnicas exactas
- Termina con frase que invite a la compra

Descripción:"""
    
    # Usar generate_with_fallback para intentar fast_model y luego fallbacks
    try:
        result, model_used = model_manager.generate_with_fallback(prompt, "description_generation")
        if result and ARGS.verbose:
            print(f"    [GEN] {model_used}: '{result[:60]}...'")
        return result
    except Exception as e:
        if ARGS.verbose:
            print(f"    [ERROR] generate_description falló: {e}")
        return None

def generate_short_description(name: str, category: str, model_manager: ModelManager) -> Optional[str]:
    """Generar descripción corta"""
    if not name:
        return None
    
    style = get_category_style(category)
    
    prompt = f"""Crea una descripción muy corta para: "{name}"

Requisitos:
- Máximo 60 caracteres
- {style}
- Comercial y atractivo
- Sin comillas en respuesta

Descripción:"""
    
    try:
        result, model_used = model_manager.generate_with_fallback(prompt, "short_description")
        if result:
            if ARGS.verbose:
                print(f"    [GEN] {model_used}: '{result[:60]}...'")
            return result[:60]
        return None
    except Exception as e:
        if ARGS.verbose:
            print(f"    [ERROR] generate_short_description falló: {e}")
        return None

def get_category_style(category: str) -> str:
    """Obtener estilo específico por categoría"""
    styles = {
        "hogar": "Enfócate en comodidad, funcionalidad y ambiente acogedor",
        "belleza": "Resalta elegancia, cuidado personal y resultados visibles", 
        "bienestar": "Destaca relajación, salud y bienestar físico/mental",
        "eco": "Enfatiza sostenibilidad y respeto por el medio ambiente",
        "mascotas": "Resalta seguridad, comodidad y bienestar de mascotas",
        "tecnologia": "Destaca innovación, practicidad y facilidad de uso",
        "ropa_hombre": "Enfócate en estilo masculino y versatilidad",
        "ropa_mujer": "Resalta estilo femenino y elegancia versátil",
        "accesorios": "Destaca diseño atractivo y funcionalidad práctica",
    }
    return styles.get(category, "Hazlo atractivo y comercial")

# -------------------- Estadísticas y Progreso --------------------
def show_progress():
    """Mostrar progreso actual"""
    pct = stats.progress_percent()
    eta = stats.eta_minutes()
    
    print(f"\n📊 PROGRESO: {stats.processed}/{stats.total_products} ({pct:.1f}%)")
    print(f"   ✅ Traducidos: {stats.translated} | 💾 Desde caché: {stats.from_cache} | ❌ Errores: {stats.errors}")
    print(f"   ⏱️ Tiempo: {stats.elapsed_time()} | ETA: {eta} min")

def show_final_stats():
    """Mostrar estadísticas finales"""
    total_time = stats.elapsed_time()
    
    print(f"\n🎉 PROCESO COMPLETADO")
    print(f"{'='*50}")
    print(f"📦 Total procesados: {stats.processed}/{stats.total_products}")
    print(f"✅ Nuevas traducciones: {stats.translated}")
    print(f"💾 Desde caché: {stats.from_cache}")
    print(f"❌ Errores: {stats.errors}")
    print(f"⏱️ Tiempo total: {total_time}")
    
    if stats.translated > 0:
        rate = stats.translated / ((datetime.now() - stats.start_time).total_seconds() / 60)
        print(f"⚡ Velocidad: {rate:.1f} traducciones/min")
    
    # Estadísticas de caché
    cache_hit_rate = (stats.from_cache / (stats.translated + stats.from_cache) * 100) if (stats.translated + stats.from_cache) > 0 else 0
    print(f"💾 Cache hit rate: {cache_hit_rate:.1f}%")

# -------------------- Control de Señales --------------------
def signal_handler(signum, frame):
    """Manejar Ctrl+C gracefully"""
    global stop_requested
    print(f"\n⚠️ Señal recibida ({signum}). Terminando proceso de forma segura...")
    stop_requested = True

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# -------------------- Función Principal --------------------
def main():
    global stats
    
    print("🔥 TRADUCTOR MASIVO PRO - SISTEMA DEFINITIVO")
    print("="*60)
    
    # Mostrar configuración
    print(f"🤖 Modelo principal: {ARGS.model}")
    print(f"🔄 Modelo respaldo: {ARGS.fallback_model}")
    print(f"⚡ Modelo rápido: {ARGS.fast_model}")
    print(f"🔧 Lote: {ARGS.batch_size} | Timeout: {ARGS.timeout}s")
    
    if ARGS.dry_run:
        print("🧪 MODO DRY-RUN: No se escribirá en la base de datos")
    
    print()
    
    # Normalizar campos a procesar
    only_fields = []
    if ARGS.only == "all":
        only_fields = ["name", "desc", "short", "long"]
    else:
        only_fields = [f.strip() for f in ARGS.only.replace(";", ",").split(",") if f.strip()]
        valid_fields = ["name", "desc", "short", "long"]
        only_fields = [f for f in only_fields if f in valid_fields]
        if not only_fields:
            only_fields = ["name", "desc", "short", "long"]
    
    print(f"📋 Campos a procesar: {', '.join(only_fields)}")
    print()
    
    # Inicializar gestor de modelos
    model_manager = ModelManager()
    
    # Obtener productos pendientes
    products = get_pending_products(ARGS.limit, only_fields)
    
    if not products:
        print("✅ No hay productos pendientes para traducir")
        return
    
    stats.total_products = len(products)
    
    print(f"🚀 Iniciando procesamiento de {len(products)} productos...")
    print()
    
    try:
        # Procesar por lotes
        total_success = 0
        
        for i in range(0, len(products), ARGS.batch_size):
            if stop_requested:
                break
                
            batch = products[i:i+ARGS.batch_size]
            batch_num = (i // ARGS.batch_size) + 1
            total_batches = (len(products) + ARGS.batch_size - 1) // ARGS.batch_size
            
            print(f"🔥 LOTE {batch_num}/{total_batches} ({len(batch)} productos)")
            print("-" * 40)
            
            success = process_product_batch(batch, model_manager, only_fields)
            total_success += success
            
            # Pausa entre lotes
            if i + ARGS.batch_size < len(products) and not stop_requested:
                sleep_seconds = ARGS.sleep_ms / 1000.0
                print(f"\n⏳ Pausa de {sleep_seconds}s...")
                time.sleep(sleep_seconds)
    
    except KeyboardInterrupt:
        print("\n⚠️ Proceso interrumpido por el usuario")
    
    finally:
        # Guardar cachés y mostrar estadísticas
        print("\n💾 Guardando cachés...")
        model_manager.finalize_caches()
        
        show_final_stats()
        
        if not ARGS.dry_run and stats.translated > 0:
            print(f"\n🎯 Para verificar los resultados:")
            print(f"   🔍 Consulta SQL: SELECT name, name_es, description_es FROM products WHERE name_es IS NOT NULL LIMIT 10;")

if __name__ == "__main__":
    main()