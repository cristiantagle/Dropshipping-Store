const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// URLs de imágenes reales para los productos de ejemplo
const REAL_IMAGES = {
  // Productos de Tecnología
  'tech001': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', // Auriculares
  'tech002': 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500', // Fitness tracker
  'tech003': 'https://images.unsplash.com/photo-1558618666-c9f1e3769c67?w=500', // Cable USB
  'tech004': 'https://images.unsplash.com/photo-1609592143508-473ac63d7ae4?w=500', // Power bank
  'tech005': 'https://images.unsplash.com/photo-1591290619947-cde9b8ebeb43?w=500', // Cargador inalámbrico

  // Productos de Mascotas
  'pet001': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500', // Juguete perro
  'pet002': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500', // Rascador gato
  'pet003': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500', // Correa perro

  // Productos de Bienestar
  'wel001': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', // Yoga mat
  'wel002': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', // Bandas resistencia
  'wel003': 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500'  // Difusor aceites
};

async function fixPlaceholderImages() {
  try {
    console.log('🔧 Corrigiendo imágenes placeholder de productos...\n');

    // Obtener productos con URLs placeholder
    const { data: products, error } = await supabase
      .from('products')
      .select('id, cj_id, name, image_url')
      .like('image_url', '%example.com%');

    if (error) {
      console.error('❌ Error consultando productos:', error);
      return;
    }

    if (!products || products.length === 0) {
      console.log('✅ No se encontraron productos con imágenes placeholder');
      return;
    }

    console.log(`📦 Encontrados ${products.length} productos con imágenes placeholder\n`);

    let updatedCount = 0;

    for (const product of products) {
      const newImageUrl = REAL_IMAGES[product.cj_id];
      
      if (newImageUrl) {
        console.log(`🔄 Actualizando ${product.cj_id}: ${product.name}`);
        console.log(`   🖼️ Nueva imagen: ${newImageUrl}`);

        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: newImageUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error actualizando ${product.cj_id}:`, updateError);
        } else {
          console.log(`✅ Actualizado correctamente`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ Sin imagen disponible para: ${product.cj_id} - ${product.name}`);
      }
      console.log('-'.repeat(60));
    }

    console.log(`\n📊 RESUMEN:`);
    console.log(`✅ Productos actualizados: ${updatedCount}`);
    console.log(`⚠️ Productos sin imagen: ${products.length - updatedCount}`);

    // Verificar resultado
    console.log('\n🔍 Verificando actualización...');
    const { data: remainingPlaceholders, error: checkError } = await supabase
      .from('products')
      .select('cj_id')
      .like('image_url', '%example.com%');

    if (!checkError) {
      console.log(`📈 Productos con placeholder restantes: ${remainingPlaceholders?.length || 0}`);
    }

    console.log('\n🎉 ¡Corrección de imágenes completada!');
    console.log('💡 Recomendación: Refrescar el frontend para ver las nuevas imágenes');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function deleteExampleProducts() {
  try {
    console.log('🗑️ ALTERNATIVA: Eliminando productos de ejemplo...\n');
    
    const { data: deleted, error } = await supabase
      .from('products')
      .delete()
      .like('image_url', '%example.com%')
      .select('cj_id, name');

    if (error) {
      console.error('❌ Error eliminando productos:', error);
      return;
    }

    console.log(`🗑️ Eliminados ${deleted?.length || 0} productos de ejemplo:`);
    deleted?.forEach(product => {
      console.log(`   • ${product.cj_id}: ${product.name}`);
    });

    console.log('\n✅ Productos de ejemplo eliminados');
    console.log('💡 Ahora puedes importar productos reales usando el script de CJ');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--delete')) {
    await deleteExampleProducts();
  } else {
    console.log('🎯 CORRECTOR DE IMÁGENES PLACEHOLDER');
    console.log('=' .repeat(50));
    console.log('Opciones:');
    console.log('  node fix_placeholder_images.js       - Actualizar con imágenes reales');
    console.log('  node fix_placeholder_images.js --delete - Eliminar productos ejemplo\n');
    
    await fixPlaceholderImages();
  }
}

main();