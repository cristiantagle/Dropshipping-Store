#!/usr/bin/env python3

import sqlite3
import json

def check_product_images():
    """Verificar las imágenes por producto"""
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Ver las tablas disponibles
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print('📋 TABLAS EN LA BASE DE DATOS:')
    for table in tables:
        print(f'  - {table[0]}')

    print()

    # Verificar estructura de la tabla Product
    try:
        cursor.execute("PRAGMA table_info(Product)")
        columns = cursor.fetchall()
        print('📋 COLUMNAS DE LA TABLA Product:')
        for col in columns:
            print(f'  - {col[1]} ({col[2]})')
        print()
    except Exception as e:
        print(f'❌ Error con tabla Product: {e}')
        return

    # Verificar algunos productos y sus imágenes
    try:
        cursor.execute('''
            SELECT id, name, images 
            FROM Product 
            WHERE name IS NOT NULL 
            LIMIT 10
        ''')

        products = cursor.fetchall()

        print('🔍 ANÁLISIS DE IMÁGENES POR PRODUCTO:\n')
        total_images = 0
        for product_id, name, images_str in products:
            try:
                images = json.loads(images_str) if images_str else []
                print(f'ID: {product_id[:8]}...')
                print(f'Nombre: {name[:50]}...')
                print(f'Número de imágenes: {len(images)}')
                total_images += len(images)
                if images:
                    print(f'Primera imagen: {images[0][:80]}...')
                print('---')
            except Exception as e:
                print(f'Error procesando producto {product_id}: {e}')
                print('---')
        
        print(f'\n📊 RESUMEN:')
        print(f'Productos analizados: {len(products)}')
        print(f'Total de imágenes: {total_images}')
        print(f'Promedio por producto: {total_images/len(products):.1f}')

    except Exception as e:
        print(f'❌ Error ejecutando consulta: {e}')

    conn.close()

if __name__ == "__main__":
    check_product_images()