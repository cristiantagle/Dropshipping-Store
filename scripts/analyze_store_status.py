#!/usr/bin/env python3
"""
📊 Análisis del Estado Actual de la Tienda
Genera recomendaciones de mejoras prioritarias
"""

import sqlite3
import json
from datetime import datetime

def analyze_store_status():
    print("📊 ANÁLISIS COMPLETO DE LA TIENDA LUNARIA")
    print("=" * 50)
    
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Obtener estadísticas generales
        cursor.execute("SELECT COUNT(*) FROM products WHERE name IS NOT NULL")
        total_products = cursor.fetchone()[0]
        
        # Productos por categoría
        cursor.execute("""
            SELECT category_slug, COUNT(*) as count 
            FROM products 
            WHERE name IS NOT NULL 
            GROUP BY category_slug 
            ORDER BY count DESC
        """)
        categories_data = cursor.fetchall()
        
        # Análisis de traducciones
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(name_es) as with_name_es,
                COUNT(description_es) as with_desc_es,
                COUNT(short_desc_es) as with_short_es,
                COUNT(long_desc_es) as with_long_es
            FROM products WHERE name IS NOT NULL
        """)
        translations = cursor.fetchone()
        
        # Productos con imágenes AI
        cursor.execute("""
            SELECT COUNT(*) 
            FROM products 
            WHERE images IS NOT NULL 
            AND json_array_length(images) > 1
        """)
        with_ai_images = cursor.fetchone()[0]
        
        print(f"📈 ESTADÍSTICAS GENERALES:")
        print(f"   Total productos: {total_products}")
        print(f"   Con imágenes AI: {with_ai_images} ({with_ai_images/total_products*100:.1f}%)")
        
        print(f"\n🌍 ESTADO DE TRADUCCIONES:")
        print(f"   Nombres traducidos: {translations[1]}/{translations[0]} ({translations[1]/translations[0]*100:.1f}%)")
        print(f"   Descripciones: {translations[2]}/{translations[0]} ({translations[2]/translations[0]*100:.1f}%)")
        print(f"   Desc. cortas: {translations[3]}/{translations[0]} ({translations[3]/translations[0]*100:.1f}%)")
        print(f"   Desc. largas: {translations[4]}/{translations[0]} ({translations[4]/translations[0]*100:.1f}%)")
        
        print(f"\n📂 PRODUCTOS POR CATEGORÍA:")
        categories_missing = []
        for category_slug, count in categories_data:
            if count == 0:
                categories_missing.append(category_slug)
            print(f"   {category_slug or 'Sin categoría'}: {count} productos")
        
        conn.close()
        
        # Generar recomendaciones
        print(f"\n🎯 RECOMENDACIONES PRIORITARIAS:")
        print("-" * 40)
        
        recommendations = []
        
        # 1. Categorías vacías
        if categories_missing:
            recommendations.append({
                "priority": "ALTA",
                "title": "Llenar categorías vacías",
                "description": f"Categorías sin productos: {', '.join(categories_missing)}",
                "action": "cd cj_import && ts-node -P tsconfig.json cj_insert.ts 100"
            })
        
        # 2. Imágenes AI
        if with_ai_images < total_products * 0.5:  # Menos del 50% tiene imágenes AI
            recommendations.append({
                "priority": "ALTA",
                "title": "Generar imágenes AI",
                "description": f"Solo {with_ai_images} productos tienen galerías de imágenes",
                "action": "python scripts/ai_image_generator.py --limit 20"
            })
        
        # 3. Funcionalidades de UX
        recommendations.append({
            "priority": "MEDIA",
            "title": "Página de búsqueda",
            "description": "Implementar búsqueda de productos por nombre/categoría",
            "action": "Crear app/buscar/page.tsx con SearchBar funcional"
        })
        
        # 4. Filtros y ordenación
        recommendations.append({
            "priority": "MEDIA", 
            "title": "Filtros en categorías",
            "description": "Agregar filtros por precio, ordenación",
            "action": "Mejorar app/categorias/[slug]/page.tsx"
        })
        
        # 5. SEO y performance
        recommendations.append({
            "priority": "MEDIA",
            "title": "SEO mejorado",
            "description": "Meta tags, Open Graph, sitemap dinámico",
            "action": "Implementar metadata dinámico por página"
        })
        
        # 6. Checkout mejorado
        recommendations.append({
            "priority": "BAJA",
            "title": "Flujo de checkout",
            "description": "Mejorar página de checkout con formularios",
            "action": "Crear app/checkout/page.tsx completo"
        })
        
        # 7. Panel de admin
        recommendations.append({
            "priority": "BAJA",
            "title": "Panel de administración",
            "description": "Dashboard para gestionar productos, órdenes",
            "action": "Crear app/admin/ con autenticación"
        })
        
        # Mostrar recomendaciones
        for i, rec in enumerate(recommendations, 1):
            priority_color = {
                "ALTA": "🔴",
                "MEDIA": "🟡", 
                "BAJA": "🟢"
            }
            print(f"\n{i}. {priority_color[rec['priority']]} **{rec['title']}** ({rec['priority']})")
            print(f"   {rec['description']}")
            print(f"   Acción: {rec['action']}")
        
        print(f"\n💡 PRÓXIMOS PASOS SUGERIDOS:")
        print("1. Ejecutar recomendaciones de prioridad ALTA")
        print("2. Probar funcionalidades existentes")
        print("3. Implementar mejoras de UX de prioridad MEDIA")
        
        return recommendations
        
    except Exception as e:
        print(f"❌ Error en análisis: {e}")
        return []

if __name__ == "__main__":
    analyze_store_status()