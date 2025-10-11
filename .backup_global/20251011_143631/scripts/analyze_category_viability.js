const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Análisis de viabilidad de categorías basado en CJ Dropshipping
const CATEGORY_ANALYSIS = {
  // Categorías con ALTA viabilidad (muchos productos en CJ)
  HIGH_VIABILITY: {
    'ropa_hombre': {
      cj_categories: ['Men\'s Clothing', 'Men\'s Shirts', 'Men\'s Jackets', 'Men\'s Sweaters', 'Suits & Blazer'],
      estimated_products: 10000,
      confidence: 'very_high',
      recommendation: 'Expandir agresivamente - categoría principal'
    },
    'ropa_mujer': {
      cj_categories: ['Women\'s Clothing', 'Lady Dresses', 'Women\'s Tops', 'Skirts', 'Women\'s Jackets'],
      estimated_products: 15000,
      confidence: 'very_high', 
      recommendation: 'Expandir agresivamente - categoría principal'
    },
    'hogar': {
      cj_categories: ['Home & Garden', 'Kitchen Storage', 'Home Office Storage', 'Furniture'],
      estimated_products: 8000,
      confidence: 'very_high',
      recommendation: 'Expandir mucho - categoría muy popular'
    },
    'tecnologia': {
      cj_categories: ['Consumer Electronics', 'Cell Phone Accessories', 'Computer Accessories'],
      estimated_products: 12000,
      confidence: 'very_high',
      recommendation: 'Expandir mucho - alta demanda'
    },
    'accesorios': {
      cj_categories: ['Jewelry', 'Bags & Accessories', 'Watches', 'Sunglasses'],
      estimated_products: 6000,
      confidence: 'high',
      recommendation: 'Expandir moderadamente'
    }
  },

  // Categorías con MEDIA viabilidad
  MEDIUM_VIABILITY: {
    'belleza': {
      cj_categories: ['Beauty & Health', 'Makeup', 'Skincare', 'Hair Care'],
      estimated_products: 3000,
      confidence: 'medium_high',
      recommendation: 'Expandir moderadamente - nicho específico'
    },
    'bienestar': {
      cj_categories: ['Sports & Entertainment', 'Fitness Equipment', 'Health Care'],
      estimated_products: 2000,
      confidence: 'medium',
      recommendation: 'Expandir moderadamente'
    },
    'mascotas': {
      cj_categories: ['Pet Supplies', 'Pet Toys', 'Pet Accessories'],
      estimated_products: 1500,
      confidence: 'medium',
      recommendation: 'Expandir moderadamente - nicho leal'
    }
  },

  // Categorías con BAJA viabilidad
  LOW_VIABILITY: {
    'eco': {
      cj_categories: ['Eco-Friendly Products'],
      estimated_products: 200,
      confidence: 'low',
      recommendation: 'CONSIDERAR ELIMINAR - muy pocos productos en CJ'
    },
    'oficina': {
      cj_categories: ['Office & School Supplies', 'Stationery'],
      estimated_products: 300,
      confidence: 'low',
      recommendation: 'CONSIDERAR ELIMINAR O FUSIONAR con hogar'
    },
    'otros': {
      cj_categories: ['Miscellaneous'],
      estimated_products: 0,
      confidence: 'none',
      recommendation: 'ELIMINAR - categoría cajón de sastre'
    }
  },

  // Categorías alternativas sugeridas
  SUGGESTED_REPLACEMENTS: {
    'automovil': {
      cj_categories: ['Automotive', 'Car Accessories', 'Motorcycle Accessories'],
      estimated_products: 4000,
      confidence: 'high',
      rationale: 'Reemplazar "eco" - alta demanda en dropshipping'
    },
    'juguetes': {
      cj_categories: ['Toys & Games', 'Educational Toys', 'Action Figures'],
      estimated_products: 5000,
      confidence: 'high',
      rationale: 'Reemplazar "oficina" - mercado grande y familiar'
    },
    'deportes': {
      cj_categories: ['Sports Equipment', 'Outdoor Activities'],
      estimated_products: 3000,
      confidence: 'medium_high',
      rationale: 'Fusionar con "bienestar" para crear categoría más robusta'
    }
  }
};

async function analyzeCurrentState() {
  const { data: products, error } = await supabase
    .from('products')
    .select('category_slug');

  if (error) {
    console.error('❌ Error:', error);
    return {};
  }

  const counts = {};
  products.forEach(product => {
    counts[product.category_slug] = (counts[product.category_slug] || 0) + 1;
  });

  return counts;
}

async function generateExpansionPlan() {
  console.log('🎯 ANÁLISIS DE VIABILIDAD DE CATEGORÍAS');
  console.log('=' .repeat(60));
  
  const currentCounts = await analyzeCurrentState();
  
  console.log('📊 ESTADO ACTUAL:');
  Object.entries(currentCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`${cat.padEnd(15)} | ${count.toString().padStart(3)} productos`);
    });

  console.log('\n🔍 ANÁLISIS DE VIABILIDAD:\n');

  // Analizar categorías de alta viabilidad
  console.log('🟢 ALTA VIABILIDAD (Expandir agresivamente):');
  console.log('-'.repeat(50));
  Object.entries(CATEGORY_ANALYSIS.HIGH_VIABILITY).forEach(([category, data]) => {
    const current = currentCounts[category] || 0;
    const target = Math.min(100, Math.floor(data.estimated_products / 100));
    console.log(`📈 ${category.toUpperCase()}: ${current} → ${target} productos`);
    console.log(`   💡 ${data.recommendation}`);
    console.log(`   🏷️  CJ categorías: ${data.cj_categories.slice(0, 3).join(', ')}`);
    console.log();
  });

  // Analizar categorías de media viabilidad
  console.log('🟡 MEDIA VIABILIDAD (Expandir moderadamente):');
  console.log('-'.repeat(50));
  Object.entries(CATEGORY_ANALYSIS.MEDIUM_VIABILITY).forEach(([category, data]) => {
    const current = currentCounts[category] || 0;
    const target = Math.min(50, Math.floor(data.estimated_products / 50));
    console.log(`📊 ${category.toUpperCase()}: ${current} → ${target} productos`);
    console.log(`   💡 ${data.recommendation}`);
    console.log();
  });

  // Analizar categorías problemáticas
  console.log('🔴 BAJA VIABILIDAD (Considerar eliminar):');
  console.log('-'.repeat(50));
  Object.entries(CATEGORY_ANALYSIS.LOW_VIABILITY).forEach(([category, data]) => {
    const current = currentCounts[category] || 0;
    console.log(`⚠️  ${category.toUpperCase()}: ${current} productos actuales`);
    console.log(`   🚨 ${data.recommendation}`);
    console.log(`   📉 Solo ~${data.estimated_products} productos disponibles en CJ`);
    console.log();
  });

  // Sugerir reemplazos
  console.log('💡 CATEGORÍAS ALTERNATIVAS SUGERIDAS:');
  console.log('-'.repeat(50));
  Object.entries(CATEGORY_ANALYSIS.SUGGESTED_REPLACEMENTS).forEach(([category, data]) => {
    console.log(`✨ ${category.toUpperCase()}: ~${data.estimated_products} productos disponibles`);
    console.log(`   💭 ${data.rationale}`);
    console.log(`   🏷️  CJ categorías: ${data.cj_categories.join(', ')}`);
    console.log();
  });

  return generateRecommendations(currentCounts);
}

function generateRecommendations(currentCounts) {
  console.log('🎯 PLAN DE ACCIÓN RECOMENDADO:');
  console.log('=' .repeat(60));

  const recommendations = [];

  // Fase 1: Eliminar categorías problemáticas
  console.log('\n📍 FASE 1: Limpieza de categorías');
  const toRemove = ['eco', 'oficina', 'otros'];
  toRemove.forEach(cat => {
    const count = currentCounts[cat] || 0;
    if (count > 0) {
      console.log(`🗑️  Reclasificar ${count} productos de "${cat}" a categorías viables`);
      recommendations.push({
        action: 'reclassify',
        category: cat,
        count: count,
        target: cat === 'oficina' ? 'hogar' : 'otros_temp'
      });
    } else {
      console.log(`🗑️  Eliminar categoría vacía: "${cat}"`);
      recommendations.push({
        action: 'remove_category',
        category: cat
      });
    }
  });

  // Fase 2: Expandir categorías principales
  console.log('\n📍 FASE 2: Expansión de categorías principales');
  const expansionTargets = {
    'ropa_mujer': 100,
    'ropa_hombre': 100, 
    'hogar': 80,
    'tecnologia': 70,
    'accesorios': 60,
    'belleza': 40,
    'bienestar': 35,
    'mascotas': 30
  };

  Object.entries(expansionTargets).forEach(([category, target]) => {
    const current = currentCounts[category] || 0;
    const needed = Math.max(0, target - current);
    if (needed > 0) {
      console.log(`📈 Importar ${needed} productos más para "${category}" (${current} → ${target})`);
      recommendations.push({
        action: 'import',
        category: category,
        current: current,
        target: target,
        needed: needed
      });
    } else {
      console.log(`✅ "${category}" ya tiene suficientes productos (${current})`);
    }
  });

  // Fase 3: Añadir nuevas categorías
  console.log('\n📍 FASE 3: Nuevas categorías (opcional)');
  console.log('🚗 automovil: 50 productos iniciales');
  console.log('🧸 juguetes: 40 productos iniciales');
  
  recommendations.push({
    action: 'add_category',
    category: 'automovil',
    target: 50
  });
  
  recommendations.push({
    action: 'add_category', 
    category: 'juguetes',
    target: 40
  });

  console.log('\n💾 Total estimado de productos a importar: ~400-500');
  console.log('⏱️  Tiempo estimado: 2-3 sesiones de importación');

  return recommendations;
}

async function main() {
  await generateExpansionPlan();
  
  console.log('\n❓ ¿Quieres proceder con el plan?');
  console.log('   Ejecuta: node scripts/execute_expansion_plan.js');
}

main();