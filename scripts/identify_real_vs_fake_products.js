const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function identifyProducts() {
  try {
    console.log('🔍 IDENTIFICANDO PRODUCTOS REALES VS ARTIFICIALES');
    console.log('=' .repeat(60));

    // Obtener todos los productos
    const { data: allProducts, error } = await supabase
      .from('products')
      .select('cj_id, name, image_url, created_at')
      .order('created_at');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Total productos en base de datos: ${allProducts.length}\n`);

    // Separar productos reales de CJ vs artificiales
    const realCJProducts = [];
    const fakeProducts = [];

    allProducts.forEach(product => {
      // Los productos reales de CJ tienen:
      // 1. cj_id numérico largo (ej: 2510090921401619300)
      // 2. image_url de cjdropshipping.com
      
      const isRealCJ = (
        product.cj_id &&
        product.cj_id.length > 15 && // IDs reales son muy largos
        /^\d+$/.test(product.cj_id) && // Solo números
        product.image_url &&
        (product.image_url.includes('cjdropshipping.com') || product.image_url.includes('oss-cf.cjdropshipping.com'))
      );

      if (isRealCJ) {
        realCJProducts.push(product);
      } else {
        fakeProducts.push(product);
      }
    });

    console.log('✅ PRODUCTOS REALES DE CJ (A CONSERVAR):');
    console.log(`   Total: ${realCJProducts.length} productos`);
    if (realCJProducts.length > 0) {
      console.log('   Ejemplos:');
      realCJProducts.slice(0, 3).forEach(p => {
        console.log(`     • ${p.cj_id}: ${p.name.substring(0, 50)}...`);
        console.log(`       📷 ${p.image_url.substring(0, 60)}...`);
      });
      if (realCJProducts.length > 3) {
        console.log(`     ... y ${realCJProducts.length - 3} más`);
      }
    }

    console.log(`\n❌ PRODUCTOS ARTIFICIALES (A ELIMINAR):`);
    console.log(`   Total: ${fakeProducts.length} productos`);
    if (fakeProducts.length > 0) {
      console.log('   Ejemplos:');
      fakeProducts.slice(0, 3).forEach(p => {
        console.log(`     • ${p.cj_id}: ${p.name.substring(0, 50)}...`);
        console.log(`       📷 ${p.image_url.substring(0, 60)}...`);
      });
      if (fakeProducts.length > 3) {
        console.log(`     ... y ${fakeProducts.length - 3} más`);
      }
    }

    console.log('\n🎯 OPCIONES DISPONIBLES:');
    console.log('=' .repeat(50));
    console.log('1. Eliminar solo productos artificiales (conservar reales)');
    console.log('   node scripts/identify_real_vs_fake_products.js --delete-fake');
    console.log('');
    console.log('2. Vaciar toda la tabla y empezar de cero con productos 100% reales');
    console.log('   node scripts/identify_real_vs_fake_products.js --clean-slate');
    console.log('');
    console.log('¿Qué prefieres?');

    return { realCJProducts, fakeProducts };

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function deleteFakeProducts() {
  console.log('🗑️ ELIMINANDO SOLO PRODUCTOS ARTIFICIALES');
  console.log('=' .repeat(50));

  try {
    // Eliminar productos que NO son de CJ real
    const { data: deleted, error } = await supabase
      .from('products')
      .delete()
      .not('image_url', 'like', '%cjdropshipping.com%')
      .select('cj_id, name');

    if (error) {
      console.error('❌ Error eliminando productos artificiales:', error);
      return;
    }

    console.log(`✅ Eliminados ${deleted?.length || 0} productos artificiales`);
    
    // Verificar lo que queda
    const { data: remaining } = await supabase
      .from('products')
      .select('category_slug');

    if (remaining) {
      const counts = {};
      remaining.forEach(p => {
        counts[p.category_slug] = (counts[p.category_slug] || 0) + 1;
      });

      console.log('\n📊 PRODUCTOS REALES CONSERVADOS:');
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
          console.log(`${cat.padEnd(15)} | ${count.toString().padStart(3)} productos`);
        });
    }

    console.log('\n✅ Limpieza completada. Solo productos REALES de CJ conservados.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function cleanSlate() {
  console.log('🧹 VACIANDO TODA LA TABLA PARA EMPEZAR DE CERO');
  console.log('=' .repeat(50));

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todo

    if (error) {
      console.error('❌ Error vaciando tabla:', error);
      return;
    }

    console.log('✅ Tabla productos completamente vaciada');
    console.log('🎯 Ahora puedes importar productos 100% reales de CJ desde cero');
    console.log('💡 Usa tu sistema de importación: cj_import_category.ts');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--delete-fake')) {
    await deleteFakeProducts();
  } else if (args.includes('--clean-slate')) {
    await cleanSlate();
  } else {
    await identifyProducts();
  }
}

main();