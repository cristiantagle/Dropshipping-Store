const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeCJCategories() {
  try {
    console.log('🔍 Analizando categorías de CJ en la base de datos...\n');

    // Obtener todas las categorías únicas de CJ almacenadas
    const { data: products, error } = await supabase
      .from('products')
      .select('cj_category, category_slug, name')
      .order('cj_category');

    if (error) {
      console.error('❌ Error al consultar productos:', error);
      return;
    }

    // Agrupar por categoría CJ
    const categoryMap = {};
    
    products.forEach(product => {
      if (product.cj_category) {
        if (!categoryMap[product.cj_category]) {
          categoryMap[product.cj_category] = {
            count: 0,
            mappedCategories: new Set(),
            products: []
          };
        }
        categoryMap[product.cj_category].count++;
        categoryMap[product.cj_category].mappedCategories.add(product.category_slug);
        categoryMap[product.cj_category].products.push({
          name: product.name,
          category: product.category_slug
        });
      }
    });

    console.log('📊 CATEGORÍAS DE CJ ENCONTRADAS EN LA BASE DE DATOS:\n');
    console.log('=' .repeat(80));

    Object.entries(categoryMap)
      .sort((a, b) => b[1].count - a[1].count) // Ordenar por cantidad de productos
      .forEach(([cjCategory, data]) => {
        console.log(`\n🏷️  CATEGORÍA CJ: "${cjCategory}"`);
        console.log(`   📦 Productos: ${data.count}`);
        console.log(`   🎯 Mapeado a: ${Array.from(data.mappedCategories).join(', ')}`);
        
        // Mostrar algunos ejemplos de productos
        if (data.products.length > 0) {
          console.log(`   📋 Ejemplos:`);
          data.products.slice(0, 3).forEach(product => {
            console.log(`      • "${product.name}" → ${product.category}`);
          });
          if (data.products.length > 3) {
            console.log(`      ... y ${data.products.length - 3} más`);
          }
        }
        console.log('   ' + '-'.repeat(60));
      });

    // Resumen por categorías mapeadas
    console.log('\n\n📈 RESUMEN POR CATEGORÍAS DE LA TIENDA:');
    console.log('=' .repeat(80));

    const storeCategoryMap = {};
    products.forEach(product => {
      if (product.category_slug) {
        if (!storeCategoryMap[product.category_slug]) {
          storeCategoryMap[product.category_slug] = {
            count: 0,
            cjCategories: new Set()
          };
        }
        storeCategoryMap[product.category_slug].count++;
        if (product.cj_category) {
          storeCategoryMap[product.category_slug].cjCategories.add(product.cj_category);
        }
      }
    });

    Object.entries(storeCategoryMap)
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([storeCategory, data]) => {
        console.log(`\n🎯 ${storeCategory.toUpperCase()}: ${data.count} productos`);
        console.log(`   🏷️  Provienen de CJ categorías: ${Array.from(data.cjCategories).join(', ')}`);
      });

    // Productos sin categoría CJ
    const productsWithoutCJCategory = products.filter(p => !p.cj_category).length;
    if (productsWithoutCJCategory > 0) {
      console.log(`\n⚠️  ${productsWithoutCJCategory} productos sin categoría CJ especificada`);
    }

    console.log('\n✅ Análisis completado');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeCJCategories();