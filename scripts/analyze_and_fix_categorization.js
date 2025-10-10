const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Función de mapeo mejorada y más precisa
function improvedMapCategory(productName, cjCategory) {
  const name = productName.toLowerCase();
  const category = (cjCategory || '').toLowerCase();
  
  // Reglas específicas y precisas por orden de prioridad
  
  // 1. ROPA MUJER - Patrones muy específicos
  if (
    name.includes("women's") ||
    name.includes('woman') ||
    name.includes('lady') ||
    name.includes('ladies') ||
    name.includes('dress') ||
    name.includes('skirt') ||
    name.includes('blouse') ||
    name.includes('bra') ||
    name.includes('lingerie') ||
    (name.includes('girls') && !name.includes('for girls')) || // "girls' cape" pero no "toys for girls"
    name.includes('female')
  ) {
    return 'ropa_mujer';
  }
  
  // 2. ROPA HOMBRE - Patrones específicos
  if (
    name.includes("men's") ||
    name.includes('male') ||
    name.includes('gentleman') ||
    (name.includes('suit') && (name.includes('men') || name.includes('male'))) ||
    (name.includes('tie') && !name.includes('bow tie')) ||
    name.includes('masculine')
  ) {
    return 'ropa_hombre';
  }
  
  // 3. BELLEZA - Patrones muy específicos
  if (
    name.includes('lipstick') ||
    name.includes('makeup') ||
    name.includes('cosmetic') ||
    name.includes('foundation') ||
    name.includes('mascara') ||
    name.includes('eyeliner') ||
    name.includes('eyeshadow') ||
    name.includes('moisturizing') ||
    name.includes('skincare') ||
    name.includes('beauty') ||
    name.includes('perfume') ||
    name.includes('fragrance') ||
    name.includes('shampoo') ||
    name.includes('conditioner') ||
    name.includes('nail polish') ||
    name.includes('face cream') ||
    name.includes('serum')
  ) {
    return 'belleza';
  }
  
  // 4. TECNOLOGÍA - Patrones específicos
  if (
    name.includes('phone') ||
    name.includes('computer') ||
    name.includes('laptop') ||
    name.includes('tablet') ||
    name.includes('charger') ||
    name.includes('cable') ||
    name.includes('bluetooth') ||
    name.includes('wireless') ||
    name.includes('headphone') ||
    name.includes('earphone') ||
    name.includes('speaker') ||
    name.includes('mouse') ||
    name.includes('keyboard') ||
    name.includes('monitor') ||
    name.includes('electronic') ||
    name.includes('smart watch') ||
    name.includes('smartwatch') ||
    name.includes('power bank') ||
    name.includes('usb')
  ) {
    return 'tecnologia';
  }
  
  // 5. MASCOTAS - Patrones específicos
  if (
    name.includes('pet') ||
    name.includes('dog') ||
    name.includes('cat') ||
    name.includes('puppy') ||
    name.includes('kitten') ||
    name.includes('bird') ||
    name.includes('fish') ||
    name.includes('pet supplies') ||
    name.includes('pet food') ||
    name.includes('pet toy') ||
    name.includes('leash') ||
    name.includes('collar') ||
    name.includes('pet bed')
  ) {
    return 'mascotas';
  }
  
  // 6. BIENESTAR - Patrones específicos
  if (
    name.includes('fitness') ||
    name.includes('yoga') ||
    name.includes('exercise') ||
    name.includes('workout') ||
    name.includes('gym') ||
    name.includes('massage') ||
    name.includes('wellness') ||
    name.includes('meditation') ||
    name.includes('health') ||
    name.includes('vitamin') ||
    name.includes('supplement') ||
    name.includes('therapy') ||
    name.includes('sports') ||
    name.includes('running') ||
    name.includes('training')
  ) {
    return 'bienestar';
  }
  
  // 7. ACCESORIOS - Patrones específicos
  if (
    name.includes('jewelry') ||
    name.includes('necklace') ||
    name.includes('bracelet') ||
    name.includes('ring') ||
    name.includes('earring') ||
    name.includes('watch') ||
    name.includes('bag') ||
    name.includes('purse') ||
    name.includes('wallet') ||
    name.includes('belt') ||
    name.includes('hat') ||
    name.includes('cap') ||
    name.includes('scarf') ||
    name.includes('glove') ||
    name.includes('sunglasses') ||
    name.includes('shoes') ||
    name.includes('boots') ||
    name.includes('sandals') ||
    name.includes('sneakers')
  ) {
    return 'accesorios';
  }
  
  // 8. HOGAR - Patrones específicos
  if (
    name.includes('home') ||
    name.includes('house') ||
    name.includes('kitchen') ||
    name.includes('lamp') ||
    name.includes('light') ||
    name.includes('furniture') ||
    name.includes('chair') ||
    name.includes('table') ||
    name.includes('storage') ||
    name.includes('organizer') ||
    name.includes('decoration') ||
    name.includes('candle') ||
    name.includes('vase') ||
    name.includes('mirror') ||
    name.includes('curtain') ||
    name.includes('pillow') ||
    name.includes('blanket') ||
    name.includes('towel') ||
    name.includes('rug') ||
    name.includes('carpet') ||
    name.includes('cleaning') ||
    name.includes('bathroom') ||
    name.includes('bedroom') ||
    name.includes('living room')
  ) {
    return 'hogar';
  }
  
  // 9. Patrones de ropa genéricos (cuando no se puede determinar el género)
  if (
    name.includes('sweater') ||
    name.includes('hoodie') ||
    name.includes('jacket') ||
    name.includes('coat') ||
    name.includes('pants') ||
    name.includes('trousers') ||
    name.includes('jeans') ||
    name.includes('shirt') ||
    name.includes('vest') ||
    name.includes('clothing')
  ) {
    // Intentar determinar género por contexto
    if (name.includes('loose') || name.includes('floral') || name.includes('elegant')) {
      return 'ropa_mujer';
    } else if (name.includes('formal') || name.includes('business')) {
      return 'ropa_hombre';
    } else {
      return 'ropa_hombre'; // Default para ropa genérica
    }
  }
  
  return 'otros';
}

async function analyzeProductCategorization() {
  try {
    console.log('🔍 ANALIZANDO CATEGORIZACIÓN DE PRODUCTOS');
    console.log('=' .repeat(60));

    // Obtener todos los productos
    const { data: products, error } = await supabase
      .from('products')
      .select('id, cj_id, name, category_slug, cj_category')
      .order('name');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Analizando ${products.length} productos...\n`);

    const corrections = [];
    let correctCount = 0;

    products.forEach(product => {
      const currentCategory = product.category_slug;
      const suggestedCategory = improvedMapCategory(product.name, product.cj_category);
      
      if (currentCategory !== suggestedCategory) {
        corrections.push({
          id: product.id,
          cj_id: product.cj_id,
          name: product.name,
          current: currentCategory,
          suggested: suggestedCategory,
          cj_category: product.cj_category
        });
      } else {
        correctCount++;
      }
    });

    console.log(`✅ Productos bien categorizados: ${correctCount}`);
    console.log(`⚠️ Productos mal categorizados: ${corrections.length}\n`);

    if (corrections.length > 0) {
      console.log('🔧 PRODUCTOS A CORREGIR:');
      console.log('=' .repeat(80));
      
      // Agrupar correcciones por tipo de cambio
      const changeGroups = {};
      corrections.forEach(correction => {
        const changeKey = `${correction.current} → ${correction.suggested}`;
        if (!changeGroups[changeKey]) {
          changeGroups[changeKey] = [];
        }
        changeGroups[changeKey].push(correction);
      });

      Object.entries(changeGroups).forEach(([changeType, items]) => {
        console.log(`\n📋 ${changeType} (${items.length} productos):`);
        items.slice(0, 3).forEach(item => {
          console.log(`   • "${item.name}"`);
          console.log(`     CJ Category: ${item.cj_category}`);
        });
        if (items.length > 3) {
          console.log(`   ... y ${items.length - 3} más`);
        }
      });

      console.log('\n🎯 OPCIONES:');
      console.log('1. Aplicar correcciones automáticamente:');
      console.log('   node scripts/analyze_and_fix_categorization.js --fix');
      console.log('\n2. Solo mostrar análisis (actual)');
      
      return corrections;
    } else {
      console.log('🎉 ¡Todos los productos están bien categorizados!');
      return [];
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function applyCorrections() {
  console.log('🔧 APLICANDO CORRECCIONES AUTOMÁTICAS');
  console.log('=' .repeat(50));

  try {
    // Obtener correcciones
    const { data: products, error } = await supabase
      .from('products')
      .select('id, cj_id, name, category_slug, cj_category');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    const corrections = [];
    products.forEach(product => {
      const currentCategory = product.category_slug;
      const suggestedCategory = improvedMapCategory(product.name, product.cj_category);
      
      if (currentCategory !== suggestedCategory) {
        corrections.push({
          id: product.id,
          cj_id: product.cj_id,
          name: product.name,
          current: currentCategory,
          suggested: suggestedCategory
        });
      }
    });

    console.log(`🔄 Aplicando ${corrections.length} correcciones...\n`);

    let successCount = 0;
    for (const correction of corrections) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ category_slug: correction.suggested })
        .eq('id', correction.id);

      if (updateError) {
        console.error(`❌ Error corrigiendo ${correction.cj_id}:`, updateError);
      } else {
        console.log(`✅ ${correction.name.substring(0, 50)}...`);
        console.log(`   ${correction.current} → ${correction.suggested}`);
        successCount++;
      }
    }

    console.log(`\n📊 RESUMEN:`);
    console.log(`✅ Correcciones aplicadas: ${successCount}`);
    console.log(`❌ Errores: ${corrections.length - successCount}`);

    // Mostrar nueva distribución
    const { data: updatedProducts } = await supabase
      .from('products')
      .select('category_slug');

    if (updatedProducts) {
      const counts = {};
      updatedProducts.forEach(p => {
        counts[p.category_slug] = (counts[p.category_slug] || 0) + 1;
      });

      console.log('\n📈 NUEVA DISTRIBUCIÓN:');
      console.log('=' .repeat(40));
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
          console.log(`${cat.padEnd(15)} | ${count.toString().padStart(3)} productos`);
        });
    }

  } catch (error) {
    console.error('❌ Error aplicando correcciones:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--fix')) {
    await applyCorrections();
  } else {
    await analyzeProductCategorization();
  }
}

main();