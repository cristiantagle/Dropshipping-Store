import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Necesitamos el service role key para UPDATE
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 RECLASIFICACIÓN AUTOMÁTICA DE PRODUCTOS\n');

if (!url || !key) {
  console.error('❌ Faltan variables de entorno.');
  process.exit(1);
}

// Cliente con permisos de escritura
const supabaseAdmin = createClient(url, SUPABASE_SERVICE_ROLE_KEY || key);

// Palabras clave para detectar ropa de mujer
const WOMEN_KEYWORDS = [
  'women', 'woman', 'ladies', 'lady', 'female', 'girl', 'girls',
  'dress', 'skirt', 'blouse', 'gown', 'camisole', 'leggings', 
  'romper', 'bra', 'lingerie', 'heels', 'purse', 'handbag',
  'mujeres', 'mujer', 'dama', 'señora', 'femenino', 'chica',
  'vestido', 'falda', 'blusa'
];

try {
  console.log('📊 Identificando productos mal categorizados...\n');
  
  // Obtener productos de ropa_hombre que son realmente de mujer
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, name_es, category_slug, cj_category')
    .eq('category_slug', 'ropa_hombre');

  if (error) throw error;

  // Filtrar productos que realmente son de mujer
  const womenProducts = [];
  const nonClothingProducts = [];

  products.forEach(product => {
    const nameText = `${product.name} ${product.name_es || ''}`.toLowerCase();
    
    // Detectar productos de mujer
    const hasWomenKeywords = WOMEN_KEYWORDS.some(keyword => nameText.includes(keyword));
    if (hasWomenKeywords) {
      womenProducts.push(product);
    }
    
    // Detectar productos que no son ropa (homewear)
    if (nameText.includes('homewear') || nameText.includes('home')) {
      nonClothingProducts.push(product);
    }
  });

  console.log(`✅ Encontrados ${womenProducts.length} productos de mujer mal categorizados`);
  console.log(`✅ Encontrados ${nonClothingProducts.length} productos no-ropa mal categorizados\n`);

  // Reclasificar productos de mujer
  if (womenProducts.length > 0) {
    console.log('🔄 Moviendo productos de mujer a ropa_mujer...');
    
    const womenIds = womenProducts.map(p => p.id);
    
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ category_slug: 'ropa_mujer' })
      .in('id', womenIds);

    if (updateError) {
      console.error('❌ Error actualizando productos de mujer:', updateError.message);
    } else {
      console.log(`✅ ${womenProducts.length} productos movidos a ROPA_MUJER\n`);
      
      // Mostrar algunos ejemplos
      console.log('📝 Ejemplos de productos reclasificados:');
      womenProducts.slice(0, 5).forEach((product, index) => {
        console.log(`   ${index + 1}. "${product.name}"`);
      });
      if (womenProducts.length > 5) {
        console.log(`   ... y ${womenProducts.length - 5} más\n`);
      }
    }
  }

  // Reclasificar productos no-ropa a "hogar"
  if (nonClothingProducts.length > 0) {
    console.log('🔄 Moviendo productos no-ropa a hogar...');
    
    const nonClothingIds = nonClothingProducts.map(p => p.id);
    
    const { error: updateError2 } = await supabaseAdmin
      .from('products')
      .update({ category_slug: 'hogar' })
      .in('id', nonClothingIds);

    if (updateError2) {
      console.error('❌ Error actualizando productos no-ropa:', updateError2.message);
    } else {
      console.log(`✅ ${nonClothingProducts.length} productos movidos a HOGAR\n`);
    }
  }

  // Verificar resultados
  console.log('🔍 Verificando resultados...\n');
  
  // Contar productos por categoría después de la corrección
  const { data: stats, error: statsError } = await supabaseAdmin
    .from('products')
    .select('category_slug')
    .in('category_slug', ['ropa_hombre', 'ropa_mujer', 'hogar']);

  if (!statsError && stats) {
    const counts = stats.reduce((acc, product) => {
      acc[product.category_slug] = (acc[product.category_slug] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 NUEVA DISTRIBUCIÓN:');
    console.log(`   Ropa Hombre: ${counts.ropa_hombre || 0} productos`);
    console.log(`   Ropa Mujer: ${counts.ropa_mujer || 0} productos`);
    console.log(`   Hogar: ${counts.hogar || 0} productos`);
    console.log('');
  }

  console.log('🎉 RECLASIFICACIÓN COMPLETADA EXITOSAMENTE!');
  console.log('💡 Recomendación: Verifica la nueva distribución ejecutando analyze_translations.mjs');

} catch (e) {
  console.error('❌ Error:', e?.message ?? e);
  process.exit(1);
}