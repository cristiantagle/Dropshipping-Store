const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeMensClothing() {
  try {
    console.log('🔍 ANALIZANDO ROPA DE HOMBRE ESPECÍFICAMENTE');
    console.log('=' .repeat(60));

    // Obtener productos clasificados como ropa_hombre
    const { data: mensProducts, error } = await supabase
      .from('products')
      .select('id, cj_id, name, category_slug, cj_category')
      .eq('category_slug', 'ropa_hombre')
      .order('name');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Productos en categoría ropa_hombre: ${mensProducts.length}\n`);

    const actualMens = [];
    const misclassified = [];

    mensProducts.forEach(product => {
      const name = product.name.toLowerCase();
      
      // Detectar indicadores claros de ropa femenina
      const femaleIndicators = [
        "women's", 'woman', 'ladies', 'lady', 'female', 
        'dress', 'skirt', 'blouse', 'bra', 'lingerie',
        'girls\'', 'feminine', 'she', 'her'
      ];
      
      // Detectar indicadores claros de ropa masculina
      const maleIndicators = [
        "men's", 'male', 'masculine', 'gentleman', 
        'he', 'his', 'men', 'boys\'', 'boy'
      ];
      
      const hasFemaleIndicator = femaleIndicators.some(indicator => name.includes(indicator));
      const hasMaleIndicator = maleIndicators.some(indicator => name.includes(indicator));
      
      if (hasFemaleIndicator) {
        misclassified.push({
          ...product,
          reason: 'Contiene indicadores femeninos'
        });
      } else if (hasMaleIndicator) {
        actualMens.push(product);
      } else {
        // Analizar contexto para productos sin indicadores claros
        const suspiciousWords = [
          'loose', 'elegant', 'graceful', 'floral', 'delicate', 
          'cute', 'sweet', 'romantic', 'chic', 'stylish',
          'slim fit women', 'for women', 'female fit'
        ];
        
        const isSuspicious = suspiciousWords.some(word => name.includes(word));
        
        if (isSuspicious) {
          misclassified.push({
            ...product,
            reason: 'Contexto sugiere ropa femenina'
          });
        } else {
          actualMens.push(product);
        }
      }
    });

    console.log('✅ PRODUCTOS GENUINAMENTE MASCULINOS:');
    console.log(`   Total: ${actualMens.length} productos\n`);
    
    if (actualMens.length > 0) {
      console.log('📋 Ejemplos de ropa masculina REAL:');
      actualMens.slice(0, 5).forEach(product => {
        console.log(`   • "${product.name}"`);
        console.log(`     CJ Category: ${product.cj_category}`);
      });
      if (actualMens.length > 5) {
        console.log(`   ... y ${actualMens.length - 5} más`);
      }
    }

    console.log('\n❌ PRODUCTOS MAL CLASIFICADOS COMO ROPA MASCULINA:');
    console.log(`   Total: ${misclassified.length} productos\n`);
    
    if (misclassified.length > 0) {
      console.log('🔧 Productos a reclasificar:');
      misclassified.forEach(product => {
        console.log(`   • "${product.name}"`);
        console.log(`     CJ Category: ${product.cj_category}`);
        console.log(`     Razón: ${product.reason}`);
        console.log('     ---');
      });

      console.log(`\n📊 RESUMEN:`);
      console.log(`✅ Ropa masculina real: ${actualMens.length}`);
      console.log(`❌ Mal clasificados: ${misclassified.length}`);
      console.log(`📈 Porcentaje de error: ${Math.round((misclassified.length / mensProducts.length) * 100)}%`);

      console.log('\n🎯 OPCIONES:');
      console.log('1. Corregir automáticamente los mal clasificados:');
      console.log('   node scripts/analyze_mens_clothing.js --fix');
      console.log('\n2. Solo mostrar análisis (actual)');
    } else {
      console.log('🎉 ¡Todos los productos están correctamente clasificados como ropa masculina!');
    }

    // Analizar disponibilidad general de ropa masculina en CJ
    console.log('\n🔍 ANALIZANDO DISPONIBILIDAD DE ROPA MASCULINA EN CJ:');
    console.log('-'.repeat(50));

    const { data: allProducts } = await supabase
      .from('products')
      .select('name, cj_category')
      .order('name');

    let potentialMensClothing = 0;
    let potentialWomensClothing = 0;
    let unisexClothing = 0;

    allProducts.forEach(product => {
      const name = product.name.toLowerCase();
      const category = (product.cj_category || '').toLowerCase();
      
      if (name.includes("men's") || name.includes('male') || name.includes('masculine')) {
        potentialMensClothing++;
      } else if (name.includes("women's") || name.includes('woman') || name.includes('female') || name.includes('ladies')) {
        potentialWomensClothing++;
      } else if (name.includes('sweater') || name.includes('jacket') || name.includes('shirt') || name.includes('pants')) {
        unisexClothing++;
      }
    });

    console.log(`👔 Productos claramente masculinos: ${potentialMensClothing}`);
    console.log(`👗 Productos claramente femeninos: ${potentialWomensClothing}`);
    console.log(`👕 Ropa unisex/genérica: ${unisexClothing}`);
    
    const ratio = potentialWomensClothing / potentialMensClothing;
    console.log(`📊 Ratio mujeres/hombres: ${ratio.toFixed(2)}:1`);
    
    if (ratio > 3) {
      console.log('\n💡 CONCLUSIÓN: CJ Dropshipping tiene MUCHA más ropa femenina que masculina');
      console.log('   Esto es normal en el mercado de dropshipping - las mujeres compran más ropa online');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function fixMisclassifiedMens() {
  console.log('🔧 CORRIGIENDO ROPA FEMENINA MAL CLASIFICADA EN ROPA MASCULINA');
  console.log('=' .repeat(60));

  try {
    // Obtener productos mal clasificados
    const { data: mensProducts, error } = await supabase
      .from('products')
      .select('id, cj_id, name, category_slug, cj_category')
      .eq('category_slug', 'ropa_hombre');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    const toCorrect = [];

    mensProducts.forEach(product => {
      const name = product.name.toLowerCase();
      
      // Usar la misma lógica del análisis
      const femaleIndicators = [
        "women's", 'woman', 'ladies', 'lady', 'female', 
        'dress', 'skirt', 'blouse', 'bra', 'lingerie',
        'girls\'', 'feminine', 'she', 'her'
      ];
      
      const maleIndicators = [
        "men's", 'male', 'masculine', 'gentleman', 
        'he', 'his', 'men', 'boys\'', 'boy'
      ];
      
      const hasFemaleIndicator = femaleIndicators.some(indicator => name.includes(indicator));
      const hasMaleIndicator = maleIndicators.some(indicator => name.includes(indicator));
      
      if (hasFemaleIndicator) {
        toCorrect.push({
          ...product,
          newCategory: 'ropa_mujer',
          reason: 'Contiene indicadores femeninos'
        });
      } else if (!hasMaleIndicator) {
        // Analizar contexto para productos sin indicadores claros
        const suspiciousWords = [
          'loose', 'elegant', 'graceful', 'floral', 'delicate', 
          'cute', 'sweet', 'romantic', 'chic', 'stylish',
          'slim fit women', 'for women', 'female fit'
        ];
        
        const isSuspicious = suspiciousWords.some(word => name.includes(word));
        
        if (isSuspicious) {
          toCorrect.push({
            ...product,
            newCategory: 'ropa_mujer',
            reason: 'Contexto sugiere ropa femenina'
          });
        }
      }
    });

    console.log(`🔄 Corrigiendo ${toCorrect.length} productos...\n`);

    let correctedCount = 0;
    for (const product of toCorrect) {
      console.log(`✅ "${product.name.substring(0, 50)}..."`);
      console.log(`   ropa_hombre → ${product.newCategory}`);
      console.log(`   Razón: ${product.reason}`);

      const { error: updateError } = await supabase
        .from('products')
        .update({ category_slug: product.newCategory })
        .eq('id', product.id);

      if (updateError) {
        console.error(`❌ Error corrigiendo ${product.cj_id}:`, updateError);
      } else {
        correctedCount++;
      }
      console.log('   ---');
    }

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

    console.log(`\n📊 RESUMEN:`);
    console.log(`✅ Productos corregidos: ${correctedCount}`);

  } catch (error) {
    console.error('❌ Error aplicando correcciones:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--fix')) {
    await fixMisclassifiedMens();
  } else {
    await analyzeMensClothing();
  }
}

main();