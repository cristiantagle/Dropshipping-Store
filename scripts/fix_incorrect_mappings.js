const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapeos correctos basados en el análisis
const corrections = [
  {
    cj_category: 'Wide Leg Pants',
    correct_category: 'ropa_mujer',
    reason: 'Pantalones de mujer mal categorizados como hogar'
  },
  {
    cj_category: 'Bras',
    correct_category: 'ropa_mujer',
    reason: 'Ropa íntima femenina debe estar en ropa_mujer, no otros'
  },
  {
    cj_category: 'Girl Clothing Sets',
    correct_category: 'ropa_mujer', 
    reason: 'Ropa de niña debería estar en ropa_mujer o crear categoría infantil'
  },
  {
    cj_category: 'Cushion Covers',
    correct_category: 'hogar',
    reason: 'Fundas de cojines son claramente artículos para el hogar'
  },
  {
    cj_category: 'Body Care',
    correct_category: 'belleza',
    reason: 'Productos de cuidado corporal pertenecen a belleza'
  }
];

async function fixIncorrectMappings() {
  try {
    console.log('🔧 Corrigiendo mapeos incorrectos de productos...\n');

    for (const correction of corrections) {
      console.log(`📝 Procesando: ${correction.cj_category}`);
      console.log(`   Razón: ${correction.reason}`);
      
      // Buscar productos con esta categoría CJ
      const { data: products, error: selectError } = await supabase
        .from('products')
        .select('id, name, category_slug, cj_category')
        .eq('cj_category', correction.cj_category);

      if (selectError) {
        console.error(`❌ Error buscando productos de ${correction.cj_category}:`, selectError);
        continue;
      }

      if (!products || products.length === 0) {
        console.log(`   ⚠️  No se encontraron productos con categoría CJ: ${correction.cj_category}`);
        continue;
      }

      console.log(`   📦 Encontrados ${products.length} producto(s) para corregir`);

      // Actualizar cada producto
      for (const product of products) {
        console.log(`   🔄 Actualizando: "${product.name}"`);
        console.log(`      ${product.category_slug} → ${correction.correct_category}`);

        const { error: updateError } = await supabase
          .from('products')
          .update({ category_slug: correction.correct_category })
          .eq('id', product.id);

        if (updateError) {
          console.error(`   ❌ Error actualizando producto ${product.id}:`, updateError);
        } else {
          console.log(`   ✅ Producto actualizado correctamente`);
        }
      }
      
      console.log('   ' + '-'.repeat(50));
    }

    // Verificar resultados finales
    console.log('\n🔍 Verificando resultados de las correcciones...\n');
    
    const { data: allProducts, error } = await supabase
      .from('products')
      .select('category_slug')
      .order('category_slug');

    if (error) {
      console.error('❌ Error verificando resultados:', error);
      return;
    }

    // Contar productos por categoría después de las correcciones
    const categoryCounts = {};
    allProducts.forEach(product => {
      categoryCounts[product.category_slug] = (categoryCounts[product.category_slug] || 0) + 1;
    });

    console.log('📊 DISTRIBUCIÓN DESPUÉS DE LAS CORRECCIONES:');
    console.log('=' .repeat(60));
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`${category.padEnd(20)} | ${count.toString().padStart(3)} productos`);
      });

    console.log('\n✅ Correcciones completadas');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixIncorrectMappings();