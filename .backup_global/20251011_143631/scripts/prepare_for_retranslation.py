import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ Faltan variables de entorno")
    exit(1)

supabase = create_client(url, key)

print("🧹 PREPARANDO PRODUCTOS PARA RE-TRADUCCIÓN")
print("=" * 50)
print()

# Buscar productos con traducciones genéricas/malas para limpiarlas
print("🔍 Buscando productos con traducciones genéricas...")

# Obtener productos con descripciones genéricas (estos necesitan re-traducción)
result = supabase.table("products").select(
    "id, name, name_es, description_es, short_desc_es, category_slug"
).eq("description_es", "Producto importado de CJ Dropshipping con traducción automática.").limit(20).execute()

products = result.data

if not products:
    print("✅ No se encontraron productos con descripciones genéricas")
    exit(0)

print(f"📊 Se encontraron {len(products)} productos con traducciones genéricas")
print()

# Mostrar ejemplos de lo que se va a limpiar
print("📋 Ejemplos de productos que se van a mejorar:")
for i, product in enumerate(products[:5]):
    print(f"  {i+1}. {product['name'][:60]}...")
    print(f"     Español actual: {product.get('name_es', 'N/A')[:60]}...")
    print()

print("🚀 OPCIONES:")
print("1. Limpiar SOLO las descripciones genéricas (conservar nombres)")
print("2. Limpiar nombres mal traducidos Y descripciones")
print("3. Limpiar todo (nombres, descripciones cortas y largas)")

choice = input("\nSelecciona una opción (1-3): ").strip()

updates_applied = 0

if choice == "1":
    # Solo limpiar descripciones y desc cortas genéricas
    print("\n🧹 Limpiando descripciones genéricas...")
    for product in products:
        update_data = {}
        
        if product.get("description_es") == "Producto importado de CJ Dropshipping con traducción automática.":
            update_data["description_es"] = None
        
        if product.get("short_desc_es") == "Excelente producto importado.":
            update_data["short_desc_es"] = None
            
        if update_data:
            supabase.table("products").update(update_data).eq("id", product["id"]).execute()
            updates_applied += 1
            print(f"  ✅ Limpiado producto {product['id']}")

elif choice == "2":
    # Limpiar nombres problemáticos y descripciones
    print("\n🧹 Limpiando nombres mal traducidos y descripciones...")
    for product in products:
        update_data = {}
        
        # Limpiar nombres que están mal traducidos (mezcla inglés-español o sin cambios)
        name_es = product.get("name_es", "")
        original_name = product.get("name", "")
        
        # Si el nombre español es igual al inglés o tiene mezclas raras
        if (name_es == original_name or 
            "Small Night Lámpara" in name_es or
            "Mujeres" in name_es or
            "Anillo Pet" in name_es):
            update_data["name_es"] = None
            
        # Limpiar descripciones genéricas
        if product.get("description_es") == "Producto importado de CJ Dropshipping con traducción automática.":
            update_data["description_es"] = None
        
        if product.get("short_desc_es") == "Excelente producto importado.":
            update_data["short_desc_es"] = None
            
        if update_data:
            supabase.table("products").update(update_data).eq("id", product["id"]).execute()
            updates_applied += 1
            print(f"  ✅ Limpiado producto {product['id']}")

elif choice == "3":
    # Limpiar todo
    print("\n🧹 Limpiando todos los campos de traducción...")
    for product in products:
        update_data = {
            "name_es": None,
            "description_es": None,
            "short_desc_es": None,
            "long_desc_es": None
        }
        
        supabase.table("products").update(update_data).eq("id", product["id"]).execute()
        updates_applied += 1
        print(f"  ✅ Limpiado completamente producto {product['id']}")

else:
    print("❌ Opción no válida")
    exit(1)

print(f"\n✅ Se limpiaron {updates_applied} productos")
print("\n🚀 Ahora puedes ejecutar:")
print("   python scripts/translate_existing_improved.py --model qwen2.5:7b --dry-run --batch-size 5")
print("\n💡 Para ver el progreso:")
print("   python scripts/verify_translations.py")