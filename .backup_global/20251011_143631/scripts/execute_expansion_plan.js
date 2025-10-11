const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Plan de expansión por fases
const EXPANSION_PLAN = {
  // Fase 1: Limpiar categorías problemáticas
  CLEANUP: [
    { category: 'otros', action: 'reclassify_to_hogar' },
    { category: 'eco', action: 'remove_from_frontend' },
    { category: 'oficina', action: 'remove_from_frontend' }
  ],

  // Fase 2: Expansión prioritaria (alta demanda)
  HIGH_PRIORITY: [
    { category: 'tecnologia', current: 6, target: 70, needed: 64 },
    { category: 'hogar', current: 15, target: 80, needed: 65 },
    { category: 'ropa_hombre', current: 31, target: 100, needed: 69 },
    { category: 'ropa_mujer', current: 32, target: 100, needed: 68 }
  ],

  // Fase 3: Expansión secundaria
  MEDIUM_PRIORITY: [
    { category: 'accesorios', current: 12, target: 60, needed: 48 },
    { category: 'belleza', current: 4, target: 40, needed: 36 },
    { category: 'bienestar', current: 5, target: 35, needed: 30 },
    { category: 'mascotas', current: 5, target: 30, needed: 25 }
  ],

  // Fase 4: Nuevas categorías (opcional)
  NEW_CATEGORIES: [
    { category: 'automovil', target: 50, needed: 50 },
    { category: 'juguetes', target: 40, needed: 40 }
  ]
};

// Generador de productos realistas por categoría
function generateProductsForCategory(category, count) {
  const productTemplates = {
    tecnologia: [
      { name: 'Wireless Bluetooth Earbuds Pro', price: 45.99, keywords: ['bluetooth', 'earbuds', 'wireless'] },
      { name: 'Smart Watch Fitness Tracker', price: 89.99, keywords: ['smartwatch', 'fitness', 'tracker'] },
      { name: 'Portable Phone Charger Power Bank', price: 29.99, keywords: ['charger', 'power', 'portable'] },
      { name: 'USB-C Fast Charging Cable', price: 15.99, keywords: ['usb', 'cable', 'fast'] },
      { name: 'Wireless Phone Holder Car Mount', price: 19.99, keywords: ['holder', 'car', 'mount'] }
    ],
    hogar: [
      { name: 'Kitchen Stainless Steel Knife Set', price: 39.99, keywords: ['kitchen', 'knife', 'steel'] },
      { name: 'Storage Organization Containers', price: 24.99, keywords: ['storage', 'container', 'home'] },
      { name: 'LED Ceiling Light Modern', price: 55.99, keywords: ['light', 'led', 'ceiling'] },
      { name: 'Bathroom Towel Rack Wall Mount', price: 18.99, keywords: ['towel', 'rack', 'bathroom'] },
      { name: 'Kitchen Utensils Set Silicone', price: 22.99, keywords: ['utensils', 'kitchen', 'silicone'] }
    ],
    ropa_hombre: [
      { name: 'Men Casual Button Down Shirt', price: 28.99, keywords: ['men', 'shirt', 'casual'] },
      { name: 'Men Winter Warm Hooded Jacket', price: 59.99, keywords: ['men', 'jacket', 'winter'] },
      { name: 'Men Slim Fit Jeans Denim', price: 42.99, keywords: ['men', 'jeans', 'slim'] },
      { name: 'Men Pullover Knit Sweater', price: 34.99, keywords: ['men', 'sweater', 'knit'] },
      { name: 'Men Athletic Sports Shorts', price: 19.99, keywords: ['men', 'shorts', 'sports'] }
    ],
    ropa_mujer: [
      { name: 'Women Elegant Floral Dress', price: 45.99, keywords: ['women', 'dress', 'floral'] },
      { name: 'Women Cozy Knit Cardigan', price: 38.99, keywords: ['women', 'cardigan', 'knit'] },
      { name: 'Women High Waist Leggings', price: 25.99, keywords: ['women', 'leggings', 'waist'] },
      { name: 'Women Casual Blouse Top', price: 32.99, keywords: ['women', 'blouse', 'casual'] },
      { name: 'Women Winter Coat Jacket', price: 69.99, keywords: ['women', 'coat', 'winter'] }
    ],
    accesorios: [
      { name: 'Gold Plated Chain Necklace', price: 18.99, keywords: ['necklace', 'gold', 'chain'] },
      { name: 'Leather Crossbody Bag Women', price: 35.99, keywords: ['bag', 'leather', 'crossbody'] },
      { name: 'Vintage Style Sunglasses', price: 22.99, keywords: ['sunglasses', 'vintage', 'style'] },
      { name: 'Rose Gold Bracelet Set', price: 16.99, keywords: ['bracelet', 'gold', 'rose'] },
      { name: 'Classic Analog Watch', price: 48.99, keywords: ['watch', 'analog', 'classic'] }
    ],
    belleza: [
      { name: 'Hydrating Face Moisturizer Cream', price: 26.99, keywords: ['moisturizer', 'face', 'cream'] },
      { name: 'Long Lasting Matte Lipstick', price: 14.99, keywords: ['lipstick', 'matte', 'makeup'] },
      { name: 'Vitamin C Serum Anti-Aging', price: 32.99, keywords: ['serum', 'vitamin', 'aging'] },
      { name: 'Natural Face Cleansing Oil', price: 19.99, keywords: ['cleansing', 'oil', 'natural'] },
      { name: 'Eyeshadow Palette Professional', price: 28.99, keywords: ['eyeshadow', 'palette', 'makeup'] }
    ],
    bienestar: [
      { name: 'Yoga Mat Non-Slip Premium', price: 29.99, keywords: ['yoga', 'mat', 'fitness'] },
      { name: 'Resistance Bands Exercise Set', price: 18.99, keywords: ['resistance', 'bands', 'exercise'] },
      { name: 'Essential Oils Aromatherapy Kit', price: 34.99, keywords: ['oils', 'aromatherapy', 'wellness'] },
      { name: 'Foam Roller Muscle Recovery', price: 25.99, keywords: ['foam', 'roller', 'muscle'] },
      { name: 'Meditation Cushion Pillow', price: 22.99, keywords: ['meditation', 'cushion', 'pillow'] }
    ],
    mascotas: [
      { name: 'Interactive Dog Puzzle Toy', price: 21.99, keywords: ['dog', 'toy', 'puzzle'] },
      { name: 'Cat Scratching Post Tower', price: 39.99, keywords: ['cat', 'scratching', 'post'] },
      { name: 'Pet Food Water Bowl Set', price: 15.99, keywords: ['pet', 'bowl', 'food'] },
      { name: 'Dog Leash Retractable Heavy Duty', price: 24.99, keywords: ['dog', 'leash', 'retractable'] },
      { name: 'Cat Litter Box Self-Cleaning', price: 89.99, keywords: ['cat', 'litter', 'box'] }
    ],
    automovil: [
      { name: 'Car Phone Mount Dashboard', price: 16.99, keywords: ['car', 'phone', 'mount'] },
      { name: 'Auto Air Freshener Set', price: 12.99, keywords: ['car', 'air', 'freshener'] },
      { name: 'Car Floor Mats Universal', price: 34.99, keywords: ['car', 'floor', 'mats'] },
      { name: 'Dashboard Camera HD Recording', price: 79.99, keywords: ['dashboard', 'camera', 'recording'] },
      { name: 'Car Charger USB Fast Charging', price: 18.99, keywords: ['car', 'charger', 'usb'] }
    ],
    juguetes: [
      { name: 'Educational Building Blocks Set', price: 28.99, keywords: ['blocks', 'educational', 'building'] },
      { name: 'Remote Control Racing Car', price: 45.99, keywords: ['remote', 'car', 'racing'] },
      { name: 'Puzzle Game Brain Training', price: 16.99, keywords: ['puzzle', 'brain', 'game'] },
      { name: 'Plush Teddy Bear Soft Toy', price: 22.99, keywords: ['teddy', 'bear', 'plush'] },
      { name: 'Art Drawing Set for Kids', price: 19.99, keywords: ['art', 'drawing', 'kids'] }
    ]
  };

  const templates = productTemplates[category] || productTemplates.tecnologia;
  const products = [];

  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const variation = Math.floor(i / templates.length) + 1;
    
    products.push({
      cj_id: `${category}${String(Date.now() + i).slice(-6)}`,
      name: variation > 1 ? `${template.name} V${variation}` : template.name,
      name_es: translateToSpanish(template.name),
      productsku: `${category.toUpperCase()}-${String(Date.now() + i).slice(-8)}`,
      image_url: generateUnsplashImage(template.keywords),
      price_cents: Math.round(template.price * 950), // USD a CLP
      category_slug: category,
      cj_category: getCJCategoryName(category),
      description: '',
      description_es: `Excelente ${template.name.toLowerCase()} importado de CJ Dropshipping.`,
      short_desc_es: `${template.name} de alta calidad`,
      long_desc_es: `Este ${template.name.toLowerCase()} ofrece la mejor calidad y funcionalidad para satisfacer tus necesidades. Importado directamente desde CJ Dropshipping con garantía de calidad.`,
      envio: 'Envío estándar',
      destacado: Math.random() < 0.1, // 10% destacados
      sales: Math.floor(Math.random() * 50),
      envio_gratis: Math.random() < 0.3, // 30% envío gratis
      has_variants: Math.random() < 0.4,
      has_video: Math.random() < 0.2
    });
  }

  return products;
}

function translateToSpanish(englishName) {
  const translations = {
    'Wireless': 'Inalámbrico', 'Bluetooth': 'Bluetooth', 'Earbuds': 'Auriculares',
    'Smart': 'Inteligente', 'Watch': 'Reloj', 'Fitness': 'Fitness', 'Tracker': 'Rastreador',
    'Portable': 'Portátil', 'Phone': 'Teléfono', 'Charger': 'Cargador', 'Power': 'Batería',
    'Kitchen': 'Cocina', 'Knife': 'Cuchillo', 'Set': 'Conjunto', 'Storage': 'Almacenamiento',
    'Men': 'Hombres', 'Women': 'Mujeres', 'Casual': 'Casual', 'Winter': 'Invierno',
    'Premium': 'Premium', 'Professional': 'Profesional', 'Natural': 'Natural'
  };

  let translated = englishName;
  Object.entries(translations).forEach(([en, es]) => {
    translated = translated.replace(new RegExp(`\\b${en}\\b`, 'g'), es);
  });
  
  return translated;
}

function generateUnsplashImage(keywords) {
  const keyword = keywords[0] || 'product';
  return `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 999999999)}?w=500&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
}

function getCJCategoryName(category) {
  const mapping = {
    'tecnologia': 'Consumer Electronics',
    'hogar': 'Home & Garden', 
    'ropa_hombre': 'Men\'s Clothing',
    'ropa_mujer': 'Women\'s Clothing',
    'accesorios': 'Jewelry & Accessories',
    'belleza': 'Beauty & Health',
    'bienestar': 'Sports & Entertainment',
    'mascotas': 'Pet Supplies',
    'automovil': 'Automotive',
    'juguetes': 'Toys & Games'
  };
  return mapping[category] || 'General';
}

async function executePhase(phaseName, items, batchSize = 10) {
  console.log(`\n🚀 EJECUTANDO ${phaseName}:`);
  console.log('=' .repeat(50));

  let totalProcessed = 0;

  for (const item of items) {
    if (item.action === 'reclassify_to_hogar') {
      console.log(`🔄 Reclasificando productos de "${item.category}" a "hogar"`);
      const { error } = await supabase
        .from('products')
        .update({ category_slug: 'hogar' })
        .eq('category_slug', item.category);
      
      if (error) {
        console.error(`❌ Error reclasificando ${item.category}:`, error);
      } else {
        console.log(`✅ Productos de "${item.category}" reclasificados`);
      }
      continue;
    }

    if (item.needed > 0 || item.target) {
      const productsToCreate = item.needed || item.target;
      console.log(`\n📦 Generando ${productsToCreate} productos para "${item.category}"`);

      // Generar productos en lotes
      const products = generateProductsForCategory(item.category, productsToCreate);
      
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        console.log(`   🔄 Insertando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)} (${batch.length} productos)`);
        
        const { error } = await supabase
          .from('products')
          .insert(batch);

        if (error) {
          console.error(`   ❌ Error insertando lote:`, error);
        } else {
          console.log(`   ✅ Lote insertado correctamente`);
          totalProcessed += batch.length;
        }

        // Pausa pequeña para no sobrecargar la DB
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  console.log(`\n📊 ${phaseName} completada: ${totalProcessed} productos procesados`);
  return totalProcessed;
}

async function executeFullExpansion() {
  console.log('🎯 EJECUTANDO PLAN DE EXPANSIÓN MASIVA');
  console.log('=' .repeat(60));
  
  let totalProducts = 0;
  const startTime = Date.now();

  try {
    // Fase 1: Limpieza
    totalProducts += await executePhase('FASE 1 - LIMPIEZA', EXPANSION_PLAN.CLEANUP);

    // Fase 2: Alta prioridad (en lotes pequeños para no sobrecargar)
    totalProducts += await executePhase('FASE 2 - ALTA PRIORIDAD', EXPANSION_PLAN.HIGH_PRIORITY, 8);

    // Pausa entre fases importantes
    console.log('\n⏸️  Pausa de 2 segundos antes de continuar...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Fase 3: Prioridad media
    totalProducts += await executePhase('FASE 3 - PRIORIDAD MEDIA', EXPANSION_PLAN.MEDIUM_PRIORITY, 6);

    // Verificar resultado final
    const { data: finalCounts, error } = await supabase
      .from('products')
      .select('category_slug');

    if (!error && finalCounts) {
      const counts = {};
      finalCounts.forEach(p => {
        counts[p.category_slug] = (counts[p.category_slug] || 0) + 1;
      });

      console.log('\n📈 DISTRIBUCIÓN FINAL:');
      console.log('=' .repeat(40));
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
          console.log(`${cat.padEnd(15)} | ${count.toString().padStart(3)} productos`);
        });
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n🎉 ¡EXPANSIÓN COMPLETADA!`);
    console.log(`📊 Total productos procesados: ${totalProducts}`);
    console.log(`⏱️  Tiempo total: ${duration} segundos`);
    console.log(`💡 Recomendación: Refrescar el frontend para ver todos los productos`);

  } catch (error) {
    console.error('❌ Error durante la expansión:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--confirm')) {
    await executeFullExpansion();
  } else {
    console.log('⚠️  EXPANSIÓN MASIVA DE PRODUCTOS');
    console.log('=' .repeat(50));
    console.log('Este script generará ~400+ productos en tu base de datos.');
    console.log('');
    console.log('📋 Plan de ejecución:');
    console.log('• Fase 1: Limpiar categorías problemáticas');
    console.log('• Fase 2: Expandir categorías principales (ropa, tech, hogar)');
    console.log('• Fase 3: Expandir categorías secundarias (belleza, mascotas, etc.)');
    console.log('');
    console.log('⏱️  Tiempo estimado: 3-5 minutos');
    console.log('');
    console.log('Para confirmar, ejecuta:');
    console.log('node scripts/execute_expansion_plan.js --confirm');
  }
}

main();