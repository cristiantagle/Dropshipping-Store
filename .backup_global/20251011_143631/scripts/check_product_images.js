const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProductImages() {
  try {
    console.log('🔍 Verificando URLs de imagen de productos...\n');

    // Obtener productos recién añadidos (con cj_id que empiezan con tech, pet, wel)
    const { data: newProducts, error } = await supabase
      .from('products')
      .select('cj_id, name, image_url, category_slug')
      .or('cj_id.like.tech%,cj_id.like.pet%,cj_id.like.wel%')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error consultando productos:', error);
      return;
    }

    if (!newProducts || newProducts.length === 0) {
      console.log('⚠️ No se encontraron productos recién importados');
      return;
    }

    console.log(`📦 Encontrados ${newProducts.length} productos recién importados:\n`);

    newProducts.forEach(product => {
      console.log(`🆔 ID: ${product.cj_id}`);
      console.log(`📝 Nombre: ${product.name}`);
      console.log(`🏷️ Categoría: ${product.category_slug}`);
      console.log(`🖼️ Imagen: ${product.image_url}`);
      console.log(`🔍 Válida: ${product.image_url && !product.image_url.includes('example.com') ? '✅ Sí' : '❌ No - URL placeholder'}`);
      console.log('-'.repeat(80));
    });

    // Verificar también algunos productos antiguos para comparar
    console.log('\n📊 COMPARANDO CON PRODUCTOS EXISTENTES:');
    const { data: oldProducts, error: oldError } = await supabase
      .from('products')
      .select('cj_id, name, image_url')
      .not('cj_id', 'like', 'tech%')
      .not('cj_id', 'like', 'pet%') 
      .not('cj_id', 'like', 'wel%')
      .limit(3);

    if (!oldError && oldProducts) {
      console.log('\n🔍 Muestra de productos existentes:');
      oldProducts.forEach(product => {
        console.log(`🆔 ${product.cj_id} | 🖼️ ${product.image_url.substring(0, 50)}...`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductImages();