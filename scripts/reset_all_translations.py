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

print("🔄 LIMPIANDO TODAS LAS TRADUCCIONES PARA REHACER CON qwen2.5:7b")
print("=" * 60)
print()

# Obtener total de productos
result = supabase.table("products").select("id", count="exact", head=True).execute()
total_products = getattr(result, "count", None) or 0

print(f"📊 Total de productos en la base de datos: {total_products}")
print()

print("⚠️  ATENCIÓN: Esto eliminará TODAS las traducciones existentes")
print("    Se re-traducirá todo con el modelo mejorado qwen2.5:7b")
print()

confirm = input("¿Estás seguro? Escribe 'SI' para continuar: ").strip().upper()

if confirm != "SI":
    print("❌ Operación cancelada")
    exit(0)

print()
print("🧹 Limpiando todas las traducciones...")

# Limpiar todos los campos de traducción
update_data = {
    "name_es": None,
    "description_es": None,
    "short_desc_es": None,
    "long_desc_es": None
}

try:
    # Limpiar en lotes para evitar timeouts
    batch_size = 50
    updated = 0
    
    # Obtener todos los IDs
    all_products = supabase.table("products").select("id").execute().data
    
    for i in range(0, len(all_products), batch_size):
        batch = all_products[i:i + batch_size]
        
        for product in batch:
            supabase.table("products").update(update_data).eq("id", product["id"]).execute()
            updated += 1
        
        print(f"📝 Limpiados {updated}/{len(all_products)} productos...")
    
    print(f"✅ ¡Limpieza completada! {updated} productos preparados para re-traducción")
    
except Exception as e:
    print(f"❌ Error durante la limpieza: {e}")
    exit(1)

print()
print("🚀 Ahora puedes ejecutar la traducción completa:")
print("   python scripts/translate_existing_improved.py --model qwen2.5:7b --batch-size 5 --max-loops 100")
print()
print("🔍 Para monitorear el progreso:")
print("   python scripts/verify_translations.py")