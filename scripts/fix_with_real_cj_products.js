const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteGeneratedProducts() {
  console.log('🧹 LIMPIANDO PRODUCTOS GENERADOS ARTIFICIALMENTE');
  console.log('=' .repeat(60));
  
  try {
    // Eliminar todos los productos que no provienen de CJ real (que no tienen cj_id numérico largo)
    const { data: toDelete, error: selectError } = await supabase
      .from('products')
      .select('cj_id, name')
      .not('cj_id', 'like', '%51%') // Los IDs reales de CJ contienen '51'
      .not('cj_id', 'like', '%25%'); // Algunos IDs reales también contienen '25'

    if (selectError) {
      console.error('❌ Error consultando productos a eliminar:', selectError);
      return;
    }

    console.log(`🗑️ Encontrados ${toDelete.length} productos generados artificialmente`);
    
    if (toDelete.length > 0) {
      // Mostrar algunos ejemplos
      console.log('\nEjemplos de productos a eliminar:');
      toDelete.slice(0, 5).forEach(p => {
        console.log(`   • ${p.cj_id}: ${p.name}`);
      });
      
      if (toDelete.length > 5) {
        console.log(`   ... y ${toDelete.length - 5} más`);
      }

      // Eliminar en lotes para no sobrecargar
      const batchSize = 50;
      for (let i = 0; i < toDelete.length; i += batchSize) {
        const batch = toDelete.slice(i, i + batchSize);
        const batchIds = batch.map(p => p.cj_id);
        
        console.log(`🔄 Eliminando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(toDelete.length/batchSize)}`);
        
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .in('cj_id', batchIds);

        if (deleteError) {
          console.error('❌ Error eliminando lote:', deleteError);
        } else {
          console.log('✅ Lote eliminado');
        }
      }
    }

    // Verificar lo que queda
    const { data: remaining, error: checkError } = await supabase
      .from('products')
      .select('category_slug');

    if (!checkError && remaining) {
      const counts = {};
      remaining.forEach(p => {
        counts[p.category_slug] = (counts[p.category_slug] || 0) + 1;
      });

      console.log('\n📊 PRODUCTOS RESTANTES (SOLO REALES DE CJ):');
      console.log('=' .repeat(50));
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
          console.log(`${cat.padEnd(15)} | ${count.toString().padStart(3)} productos`);
        });
    }

    console.log('\n✅ Limpieza completada. Ahora solo tienes productos REALES de CJ con imágenes REALES.');
    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('1. Usa el sistema de importación real de CJ (cj_import_category.ts)');
    console.log('2. O conecta con la API real de CJ Dropshipping');
    console.log('3. Nunca más generar productos artificiales');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--confirm-delete-fake')) {
    await deleteGeneratedProducts();
  } else {
    console.log('⚠️  CORRECCIÓN: ELIMINAR PRODUCTOS ARTIFICIALES');
    console.log('=' .repeat(60));
    console.log('');
    console.log('🚨 PROBLEMA IDENTIFICADO:');
    console.log('   Los 405 productos recién creados tienen URLs de imagen inventadas');
    console.log('   En lugar de usar la API real de CJ Dropshipping');
    console.log('');
    console.log('💡 SOLUCIÓN:');
    console.log('   1. Eliminar todos los productos artificiales');
    console.log('   2. Usar solo productos REALES de CJ con imágenes REALES');
    console.log('');
    console.log('🔧 Para proceder con la limpieza:');
    console.log('   node scripts/fix_with_real_cj_products.js --confirm-delete-fake');
  }
}

main();