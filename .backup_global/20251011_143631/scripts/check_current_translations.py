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

print("🔍 REVISANDO TRADUCCIONES ACTUALES")
print("=" * 50)
print()

# Obtener algunos productos de ejemplo
result = supabase.table("products").select(
    "id, name, name_es, description, description_es, short_desc_es, long_desc_es, category_slug"
).limit(10).execute()

products = result.data

if products:
    for i, product in enumerate(products):
        print(f"{i+1}. PRODUCTO ID: {product['id']}")
        print(f"   📂 Categoría: {product.get('category_slug', 'Sin categoría')}")
        print(f"   🇺🇸 Nombre original: {product.get('name', 'N/A')}")
        print(f"   🇪🇸 Nombre español:  {product.get('name_es', 'N/A')}")
        
        if product.get('description'):
            desc_preview = product['description'][:100] + "..." if len(product.get('description', '')) > 100 else product.get('description', '')
            print(f"   📝 Descripción original: {desc_preview}")
        
        if product.get('description_es'):
            desc_es_preview = product['description_es'][:100] + "..." if len(product.get('description_es', '')) > 100 else product.get('description_es', '')
            print(f"   📝 Descripción español: {desc_es_preview}")
        
        if product.get('short_desc_es'):
            print(f"   📄 Desc. corta: {product.get('short_desc_es')}")
            
        print()
        print("-" * 50)
        print()

print("💡 Para probar traducciones mejoradas con qwen2.5:7b:")
print("   python scripts/translate_existing_improved.py --model qwen2.5:7b --dry-run --only name --batch-size 3")
print()
print("💡 Para solo re-traducir nombres (por ejemplo):")
print("   # Primero borra algunos name_es en la BD para probar")
print("   python scripts/translate_existing_improved.py --model qwen2.5:7b --only name")