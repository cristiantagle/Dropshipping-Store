const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuración de API de CJ
const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

// Categorías CJ que queremos priorizar para balancear el inventario
const PRIORITY_CJ_CATEGORIES = [
  // Para Tecnología (solo tenemos 1 producto)
  { cj_id: '121', cj_name: 'Consumer Electronics', target_category: 'tecnologia', priority: 'high' },
  { cj_id: '122', cj_name: 'Computers & Accessories', target_category: 'tecnologia', priority: 'high' },
  { cj_id: '133', cj_name: 'Cell Phone Accessories', target_category: 'tecnologia', priority: 'high' },
  
  // Para Belleza (solo tenemos 4 productos)
  { cj_id: '66', cj_name: 'Beauty & Health', target_category: 'belleza', priority: 'high' },
  { cj_id: '1420', cj_name: 'Health & Beauty', target_category: 'belleza', priority: 'high' },
  
  // Para Mascotas (solo tenemos 2 productos) 
  { cj_id: '322', cj_name: 'Pet Supplies', target_category: 'mascotas', priority: 'high' },
  
  // Para Bienestar (solo tenemos 2 productos)
  { cj_id: '339', cj_name: 'Sports & Entertainment', target_category: 'bienestar', priority: 'medium' },
  
  // Para Oficina (nueva categoría sin productos)
  { cj_id: '1504', cj_name: 'Office & School Supplies', target_category: 'oficina', priority: 'high' },
  { cj_id: '322', cj_name: 'Home Office', target_category: 'oficina', priority: 'medium' },
  
  // Para Eco (categoría vacía)
  { cj_id: '1625', cj_name: 'Eco-Friendly', target_category: 'eco', priority: 'medium' },
];

async function fetchCJProducts(categoryId, page = 1, pageSize = 20) {
  try {
    console.log(`🔄 Obteniendo productos de categoría CJ ${categoryId}, página ${page}...`);
    
    const url = `${CJ_API_BASE}/product/list`;
    const params = new URLSearchParams({
      categoryId: categoryId.toString(),
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy: 'salesVolume', // Ordenar por volumen de ventas
      sortType: 'desc'
    });

    // Simular llamada a la API (reemplazar con llamada real)
    console.log(`   📡 Llamando API: ${url}?${params}`);
    
    // Por ahora, retornamos datos simulados para testing
    // En producción, aquí iría la llamada real a la API de CJ
    return {
      success: true,
      data: {
        list: [], // Lista vacía por ahora
        total: 0,
        page: page,
        pageSize: pageSize
      }
    };
    
  } catch (error) {
    console.error(`❌ Error fetching products from CJ category ${categoryId}:`, error);
    return { success: false, error };
  }
}

async function getCurrentCategoryCounts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category_slug');

    if (error) {
      console.error('❌ Error obteniendo recuento de categorías:', error);
      return {};
    }

    const counts = {};
    products.forEach(product => {
      counts[product.category_slug] = (counts[product.category_slug] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error('❌ Error:', error);
    return {};
  }
}

async function analyzeImportNeeds() {
  console.log('🔍 Analizando necesidades de importación...\n');
  
  const currentCounts = await getCurrentCategoryCounts();
  
  console.log('📊 ESTADO ACTUAL DEL INVENTARIO:');
  console.log('=' .repeat(50));
  
  const sortedCategories = Object.entries(currentCounts)
    .sort((a, b) => a[1] - b[1]); // Ordenar de menor a mayor
  
  sortedCategories.forEach(([category, count]) => {
    console.log(`${category.padEnd(15)} | ${count.toString().padStart(3)} productos`);
  });
  
  console.log('\n🎯 CATEGORÍAS PRIORITARIAS PARA IMPORTAR:');
  console.log('=' .repeat(50));
  
  const recommendations = [];
  
  // Analizar categorías con pocos productos
  const lowCountCategories = sortedCategories.filter(([_, count]) => count < 10);
  
  lowCountCategories.forEach(([category, count]) => {
    const targetCount = 15; // Objetivo mínimo por categoría
    const needed = targetCount - count;
    
    console.log(`📈 ${category}: ${count} → ${targetCount} productos (necesita +${needed})`);
    
    recommendations.push({
      category,
      current: count,
      target: targetCount,
      needed: needed,
      priority: count === 0 ? 'critical' : count < 5 ? 'high' : 'medium'
    });
  });
  
  return recommendations;
}

async function createImportPlan() {
  console.log('📋 Creando plan de importación balanceada...\n');
  
  const needs = await analyzeImportNeeds();
  const plan = [];
  
  // Crear plan de importación basado en necesidades y categorías CJ disponibles
  for (const need of needs) {
    const relevantCJCategories = PRIORITY_CJ_CATEGORIES.filter(cjCat => 
      cjCat.target_category === need.category
    );
    
    if (relevantCJCategories.length > 0) {
      plan.push({
        target_category: need.category,
        needed_products: need.needed,
        priority: need.priority,
        cj_categories: relevantCJCategories,
        recommended_imports: Math.min(need.needed, 10) // Máximo 10 por sesión
      });
    }
  }
  
  // Mostrar plan
  console.log('🗓️  PLAN DE IMPORTACIÓN:');
  console.log('=' .repeat(60));
  
  plan.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  plan.forEach((item, index) => {
    console.log(`\\n${index + 1}. ${item.target_category.toUpperCase()} (Prioridad: ${item.priority})`);\n    console.log(`   📦 Productos necesarios: ${item.needed_products}`);\n    console.log(`   🎯 Importar en esta sesión: ${item.recommended_imports}`);\n    console.log(`   🏷️  Categorías CJ disponibles:`);\n    item.cj_categories.forEach(cjCat => {\n      console.log(`      • ${cjCat.cj_name} (ID: ${cjCat.cj_id})`);\n    });\n  });\n  \n  return plan;\n}\n\nasync function executeImportPlan(plan, execute = false) {\n  console.log(`\\n${execute ? '🚀' : '🔍'} ${execute ? 'EJECUTANDO' : 'SIMULANDO'} PLAN DE IMPORTACIÓN...\\n`);\n  \n  for (const item of plan.slice(0, 3)) { // Procesar solo las 3 primeras prioridades\n    console.log(`📂 Procesando categoría: ${item.target_category}`);\n    \n    for (const cjCategory of item.cj_categories.slice(0, 1)) { // Una categoría CJ por vez\n      console.log(`   🔄 Importando desde: ${cjCategory.cj_name}`);\n      \n      if (execute) {\n        const result = await fetchCJProducts(cjCategory.cj_id, 1, item.recommended_imports);\n        \n        if (result.success && result.data.list.length > 0) {\n          console.log(`   ✅ Obtenidos ${result.data.list.length} productos`);\n          // Aquí iría el proceso de inserción en la base de datos\n        } else {\n          console.log(`   ⚠️  No se obtuvieron productos o error en la API`);\n        }\n      } else {\n        console.log(`   📋 [SIMULACIÓN] Se obtendrían ~${item.recommended_imports} productos`);\n      }\n    }\n  }\n  \n  console.log(`\\n${execute ? '✅ Importación completada' : '📋 Simulación completada'}`);\n}\n\nasync function main() {\n  try {\n    console.log('🎯 SISTEMA DE IMPORTACIÓN BALANCEADA DE PRODUCTOS CJ');\n    console.log('=' .repeat(60));\n    console.log('Este script analiza tu inventario actual e importa productos');\n    console.log('de categorías específicas para crear un balance optimal.\\n');\n    \n    // Paso 1: Analizar necesidades\n    const plan = await createImportPlan();\n    \n    if (plan.length === 0) {\n      console.log('🎉 ¡Tu inventario está bien balanceado! No se necesitan importaciones.');\n      return;\n    }\n    \n    // Paso 2: Mostrar plan y pedir confirmación\n    console.log('\\n❓ ¿Deseas ejecutar este plan de importación? (Por ahora solo simulación)');\n    console.log('   Para activar importación real, modificar el parámetro execute en main()\\n');\n    \n    // Paso 3: Ejecutar (simulación por defecto)\n    await executeImportPlan(plan, false); // Cambiar a true para ejecutar realmente\n    \n    console.log('\\n📈 PRÓXIMOS PASOS RECOMENDADOS:');\n    console.log('1. Conectar con la API real de CJ Dropshipping');\n    console.log('2. Implementar sistema de inserción en base de datos');\n    console.log('3. Añadir sistema de traducción automática');\n    console.log('4. Configurar importación programada\\n');\n    \n  } catch (error) {\n    console.error('❌ Error en main:', error);\n  }\n}\n\n// Ejecutar si se llama directamente\nif (require.main === module) {\n  main();\n}\n\nmodule.exports = {\n  analyzeImportNeeds,\n  createImportPlan,\n  executeImportPlan\n};"}}]}