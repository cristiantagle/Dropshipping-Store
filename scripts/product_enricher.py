#!/usr/bin/env python3
"""
🎨 SISTEMA DE ENRIQUECIMIENTO AUTOMÁTICO DE PRODUCTOS
Mejora la información pobre de CJ Dropshipping con IA y APIs externas
"""

import os
import json
import time
import requests
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import logging
from supabase import create_client, Client

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ProductEnrichment:
    """Datos enriquecidos para un producto"""
    # Descripciones mejoradas
    rich_description: str
    technical_specs: Dict[str, str]
    key_features: List[str]
    usage_instructions: str
    
    # Imágenes adicionales
    lifestyle_images: List[str]
    detail_images: List[str]
    usage_images: List[str]
    
    # SEO y Marketing
    seo_keywords: List[str]
    marketing_copy: str
    target_audience: str
    
    # Comparación y competencia
    competitor_comparison: Dict[str, Any]
    price_justification: str
    
class ProductEnricher:
    """Sistema principal de enriquecimiento de productos"""
    
    def __init__(self):
        self.supabase = self._init_supabase()
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.enrichment_prompts = self._load_enrichment_prompts()
        
    def _init_supabase(self) -> Client:
        """Inicializar cliente Supabase"""
        url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not url or not key:
            raise ValueError("Faltan variables de Supabase")
            
        return create_client(url, key)
    
    def _load_enrichment_prompts(self) -> Dict[str, str]:
        """Cargar prompts específicos para enriquecimiento"""
        return {
            'description': """
            Basándote en el nombre del producto "{product_name}" y categoría "{category}", 
            crea una descripción rica y atractiva de 150-200 palabras que incluya:
            
            1. Función principal y beneficios
            2. Características técnicas inferidas
            3. Casos de uso específicos
            4. Público objetivo
            5. Tono profesional pero accesible
            
            Escribe en español chileno, usa un tono confiable y enfócate en resolver problemas del usuario.
            """,
            
            'technical_specs': """
            Para el producto "{product_name}" en categoría "{category}", 
            genera especificaciones técnicas realistas típicas para este tipo de producto.
            
            Formato JSON:
            {{
                "Material": "valor apropiado",
                "Dimensiones": "estimación realista", 
                "Peso": "peso típico",
                "Colores": "opciones comunes",
                "Garantía": "período estándar",
                "Origen": "país típico"
            }}
            
            Solo especificaciones que sean lógicas para este producto.
            """,
            
            'key_features': """
            Lista 5-7 características clave del producto "{product_name}" que un cliente 
            querría saber antes de comprar. 
            
            Formato: lista de frases cortas y directas.
            Enfócate en beneficios prácticos y diferenciadores.
            """,
            
            'marketing_copy': """
            Crea un copy de marketing persuasivo para "{product_name}" que incluya:
            
            1. Headline llamativo
            2. 3 beneficios principales
            3. Call-to-action sutil
            4. Máximo 100 palabras
            5. Tono: moderno, confiable, chileno
            
            Evita superlativos exagerados, enfócate en valor real.
            """,
            
            'seo_keywords': """
            Genera 8-12 keywords SEO en español para "{product_name}" categoría "{category}".
            
            Incluye:
            - Palabras clave principales
            - Long-tail keywords
            - Términos de búsqueda locales (Chile)
            - Sinónimos relevantes
            
            Formato: lista separada por comas.
            """
        }
    
    def enrich_product(self, product_id: str, max_retries: int = 3) -> Optional[ProductEnrichment]:
        """Enriquecer un producto específico"""
        try:
            # 1. Obtener datos básicos del producto
            product = self._get_product_data(product_id)
            if not product:
                logger.error(f"Producto {product_id} no encontrado")
                return None
            
            logger.info(f"🎨 Enriqueciendo: {product.get('name_es', product.get('name'))}")
            
            # 2. Generar contenido enriquecido con IA
            enrichment = self._generate_ai_content(product)
            
            # 3. Generar imágenes adicionales (placeholders por ahora)
            enrichment.lifestyle_images = self._generate_placeholder_images(product, 'lifestyle')
            enrichment.detail_images = self._generate_placeholder_images(product, 'detail')
            enrichment.usage_images = self._generate_placeholder_images(product, 'usage')
            
            # 4. Guardar enriquecimiento en base de datos
            self._save_enrichment(product_id, enrichment)
            
            logger.info(f"✅ Producto {product_id} enriquecido exitosamente")
            return enrichment
            
        except Exception as e:
            logger.error(f"❌ Error enriqueciendo {product_id}: {e}")
            return None
    
    def _get_product_data(self, product_id: str) -> Optional[Dict]:
        """Obtener datos básicos del producto desde Supabase"""
        response = self.supabase.table('products').select(
            'id, name, name_es, description_es, category_slug, price_cents, image_url'
        ).eq('id', product_id).single().execute()
        
        return response.data if response.data else None
    
    def _generate_ai_content(self, product: Dict) -> ProductEnrichment:
        """Generar contenido enriquecido usando IA"""
        name = product.get('name_es') or product.get('name')
        category = product.get('category_slug', 'general')
        
        # Generar cada tipo de contenido
        description = self._call_ai_api('description', product_name=name, category=category)
        specs_json = self._call_ai_api('technical_specs', product_name=name, category=category)
        features = self._call_ai_api('key_features', product_name=name, category=category)
        marketing = self._call_ai_api('marketing_copy', product_name=name, category=category)
        keywords = self._call_ai_api('seo_keywords', product_name=name, category=category)
        
        # Parsear especificaciones técnicas
        try:
            technical_specs = json.loads(specs_json)
        except:
            technical_specs = {"Material": "Información no disponible"}
        
        # Parsear características clave
        key_features = [f.strip() for f in features.split('\n') if f.strip() and not f.startswith('-')][:7]
        
        # Parsear keywords SEO
        seo_keywords = [k.strip() for k in keywords.split(',')][:12]
        
        return ProductEnrichment(
            rich_description=description.strip(),
            technical_specs=technical_specs,
            key_features=key_features,
            usage_instructions=f"Uso recomendado para {name}. Instrucciones detalladas incluidas.",
            lifestyle_images=[],
            detail_images=[],
            usage_images=[],
            seo_keywords=seo_keywords,
            marketing_copy=marketing.strip(),
            target_audience=self._infer_target_audience(category),
            competitor_comparison={},
            price_justification=f"Precio competitivo para {category} con estas características."
        )
    
    def _call_ai_api(self, prompt_type: str, **kwargs) -> str:
        """Llamar a la API de IA (Ollama local o OpenAI)"""
        prompt = self.enrichment_prompts[prompt_type].format(**kwargs)
        
        # Mapear tipos de prompts a tipos de tareas
        task_type_map = {
            'technical_specs': 'technical',
            'seo_keywords': 'general',
            'description': 'general',
            'key_features': 'general',
            'marketing_copy': 'general'
        }
        task_type = task_type_map.get(prompt_type, 'general')
        
        # 🎯 Prioridad 1: Ollama local (gratis y rápido)
        ollama_response = self._call_ollama_api(prompt, task_type)
        if ollama_response:
            return ollama_response
            
        # 🎯 Prioridad 2: OpenAI (si está configurado)
        if self.openai_api_key:
            openai_response = self._call_openai_api(prompt)
            if openai_response:
                return openai_response
        
        # 🎯 Fallback: Contenido placeholder
        logger.warning(f"No hay IA disponible, usando placeholder para {prompt_type}")
        return self._generate_placeholder_content(prompt_type, **kwargs)
    
    def _call_ollama_api(self, prompt: str, task_type: str = 'general') -> str:
        """Llamar a Ollama local con modelo específico por tarea"""
        try:
            ollama_url = os.getenv('OLLAMA_URL', 'http://localhost:11434/api/generate')
            
            # Seleccionar modelo según la tarea
            model_map = {
                'technical': os.getenv('OLLAMA_TECHNICAL_MODEL', 'codellama:34b'),
                'translation': os.getenv('OLLAMA_TRANSLATION_MODEL', 'mixtral:8x7b'),
                'general': os.getenv('OLLAMA_MODEL', 'llama3:70b')
            }
            model = model_map.get(task_type, model_map['general'])
            
            # Fallback si el modelo específico no existe
            fallback_model = os.getenv('OLLAMA_MODEL', 'llama3:8b')
            
            # Intentar con modelo específico primero
            for attempt_model in [model, fallback_model]:
                try:
                    response = requests.post(
                        ollama_url,
                        json={
                            'model': attempt_model,
                            'prompt': f"Eres un experto en e-commerce y marketing de productos. {prompt}",
                            'stream': False,
                            'options': {
                                'temperature': 0.7,
                                'top_p': 0.9,
                                'num_predict': 500
                            }
                        },
                        timeout=120 if 'llama3:70b' in attempt_model or 'mixtral' in attempt_model else 60
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        generated_text = result.get('response', '').strip()
                        if generated_text:
                            logger.debug(f"✅ Usando modelo: {attempt_model} para {task_type}")
                            return generated_text
                    else:
                        logger.warning(f"Modelo {attempt_model} no disponible: {response.status_code}")
                        continue
                        
                except requests.exceptions.RequestException as e:
                    logger.warning(f"Error con modelo {attempt_model}: {e}")
                    continue
            
            logger.warning(f"Ningún modelo Ollama disponible para {task_type}")
            return None
                
        except Exception as e:
            logger.debug(f"Ollama no disponible: {e}")
            return None
    
    def _call_openai_api(self, prompt: str) -> str:
        """Llamar a OpenAI API (backup)"""
        try:
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {self.openai_api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'gpt-3.5-turbo',
                    'messages': [
                        {'role': 'system', 'content': 'Eres un experto en e-commerce y marketing de productos.'},
                        {'role': 'user', 'content': prompt}
                    ],
                    'max_tokens': 500,
                    'temperature': 0.7
                },
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content']
            else:
                logger.warning(f"OpenAI API failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.warning(f"Error en OpenAI API: {e}")
            return None
    
    def _generate_placeholder_content(self, prompt_type: str, **kwargs) -> str:
        """Generar contenido placeholder inteligente"""
        product_name = kwargs.get('product_name', 'Producto')
        category = kwargs.get('category', 'general')
        
        placeholders = {
            'description': f"""El {product_name} es una excelente opción para quienes buscan calidad y funcionalidad en {category}. 
            
Características principales:
            • Diseño moderno y atractivo
            • Materiales de alta calidad
            • Fácil de usar y mantener
            • Ideal para uso diario
            
Este producto combina estilo y practicidad, siendo perfecto para quienes valoran la calidad. Su diseño cuidadosamente pensado garantiza durabilidad y satisfacción en el uso.
            
¡Una inversión inteligente para tu {category}!""",
            
            'technical_specs': '''{
                "Material": "Materiales premium",
                "Dimensiones": "Tamaño estándar",
                "Peso": "Peso optimizado",
                "Colores": "Varios colores disponibles",
                "Garantía": "Garantía del fabricante",
                "Origen": "Fabricado con altos estándares"
            }''',
            
            'key_features': f"""Diseño elegante y funcional
Calidad superior garantizada
Fácil instalación y uso
Durable y resistente
Excelente relación calidad-precio
Ideal para {category}""",
            
            'marketing_copy': f"""✨ Descubre el {product_name} que estás buscando
            
🏆 Calidad premium que perdura
🚀 Diseño innovador y práctico  
💖 Satisfacción garantizada
            
Transforma tu experiencia en {category} con este producto excepcional. ¡No esperes más!""",
            
            'seo_keywords': f"{product_name}, {category} Chile, comprar {category}, {category} online, productos {category}, {category} calidad, {category} precio, {category} oferta"
        }
        
        return placeholders.get(prompt_type, f"Contenido para {product_name} en {category}")
    
    def _generate_placeholder_images(self, product: Dict, image_type: str) -> List[str]:
        """Generar URLs de imágenes placeholder hasta que tengamos Stable Diffusion"""
        base_url = "https://picsum.photos/500/500"
        product_id = product.get('id', '123')
        
        # Generar 2-3 placeholders por tipo
        images = []
        for i in range(2):
            # Usar seed basado en product_id + tipo para consistencia
            seed = abs(hash(f"{product_id}_{image_type}_{i}")) % 1000
            images.append(f"{base_url}?random={seed}")
        
        return images
    
    def _infer_target_audience(self, category: str) -> str:
        """Inferir audiencia objetivo basada en categoría"""
        audiences = {
            'belleza': 'Mujeres 18-45 interesadas en cuidado personal',
            'bienestar': 'Adultos 25-55 enfocados en salud y bienestar',
            'hogar': 'Propietarios de hogar 25-65, familias',
            'tecnologia': 'Tech enthusiasts 18-50, profesionales',
            'ropa_hombre': 'Hombres 18-45 fashion-conscious',
            'ropa_mujer': 'Mujeres 18-50 interesadas en moda',
            'mascotas': 'Dueños de mascotas 25-65',
            'eco': 'Consumidores conscientes 25-55'
        }
        return audiences.get(category, 'Público general adulto')
    
    def _save_enrichment(self, product_id: str, enrichment: ProductEnrichment):
        """Guardar datos enriquecidos en Supabase"""
        # Actualizar campos existentes
        update_data = {
            'long_desc_es': enrichment.rich_description,
            'marketing_copy': enrichment.marketing_copy,
            'technical_specs': json.dumps(enrichment.technical_specs, ensure_ascii=False),
            'key_features': json.dumps(enrichment.key_features, ensure_ascii=False),
            'seo_keywords': ','.join(enrichment.seo_keywords),
            'target_audience': enrichment.target_audience,
            'enriched_at': 'now()',
            'enrichment_version': 'v1.0'
        }
        
        # Agregar imágenes adicionales si existen
        additional_images = (
            enrichment.lifestyle_images + 
            enrichment.detail_images + 
            enrichment.usage_images
        )
        
        if additional_images:
            # Obtener imagen original y combinar
            original = self.supabase.table('products').select('image_url').eq('id', product_id).single().execute()
            all_images = [original.data['image_url']] + additional_images
            update_data['images'] = json.dumps(all_images)
        
        # Ejecutar update
        response = self.supabase.table('products').update(update_data).eq('id', product_id).execute()
        
        if response.data:
            logger.info(f"💾 Enriquecimiento guardado para {product_id}")
        else:
            logger.error(f"❌ Error guardando enriquecimiento para {product_id}")

def main():
    """Función principal para enriquecer productos"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Enriquecimiento automático de productos')
    parser.add_argument('--limit', type=int, default=10, help='Productos a enriquecer')
    parser.add_argument('--category', type=str, help='Solo productos de esta categoría')
    parser.add_argument('--product-id', type=str, help='Enriquecer producto específico')
    parser.add_argument('--dry-run', action='store_true', help='Solo mostrar sin ejecutar')
    
    args = parser.parse_args()
    
    enricher = ProductEnricher()
    
    if args.product_id:
        # Enriquecer producto específico
        result = enricher.enrich_product(args.product_id)
        if result:
            print(f"✅ Producto {args.product_id} enriquecido exitosamente")
        else:
            print(f"❌ Error enriqueciendo producto {args.product_id}")
    else:
        # Enriquecer múltiples productos
        print(f"🚀 Iniciando enriquecimiento de hasta {args.limit} productos...")
        
        # Obtener productos que necesitan enriquecimiento
        query = enricher.supabase.table('products').select('id, name_es, category_slug')
        
        if args.category:
            query = query.eq('category_slug', args.category)
        
        # Solo productos que no han sido enriquecidos
        query = query.is_('enriched_at', 'null').limit(args.limit)
        
        response = query.execute()
        products = response.data or []
        
        print(f"📦 Encontrados {len(products)} productos para enriquecer")
        
        if args.dry_run:
            for product in products:
                print(f"- {product['name_es']} ({product['category_slug']})")
            return
        
        # Enriquecer productos
        success_count = 0
        for i, product in enumerate(products, 1):
            print(f"\n[{i}/{len(products)}] Procesando: {product['name_es']}")
            
            result = enricher.enrich_product(product['id'])
            if result:
                success_count += 1
            
            # Pausa entre productos para evitar rate limiting
            if i < len(products):
                time.sleep(2)
        
        print(f"\n🎉 Proceso completado: {success_count}/{len(products)} productos enriquecidos")

if __name__ == '__main__':
    main()