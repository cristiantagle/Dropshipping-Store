const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuración CJ API
const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";
const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN;

if (!CJ_ACCESS_TOKEN) {
  console.error('❌ CJ_ACCESS_TOKEN no está definido en .env');
  process.exit(1);
}

// Mapeo de categorías (copiado de tu cj_config.ts)
function mapCategory(cjCategory) {
  if (!cjCategory) return 'otros';
  
  const lower = cjCategory.toLowerCase();
  
  // Mapeo directo basado en palabras clave de tu sistema
  const keywords = {
    hogar: ['house', 'home', 'kitchen', 'furniture', 'storage', 'lamp', 'light'],
    belleza: ['beauty', 'makeup', 'cosmetic', 'nail', 'skincare', 'perfume'],
    bienestar: ['wellness', 'health', 'fitness', 'yoga', 'massage', 'supplement'],
    tecnologia: ['tech', 'technology', 'gadget', 'phone', 'computer', 'electronic'],
    ropa_hombre: ['men', 'male', 'jacket', 'shirt', 'sweater'],
    ropa_mujer: ['women', 'woman', 'lady', 'dress', 'skirt', 'blouse'],
    accesorios: ['jewelry', 'bracelet', 'necklace', 'bag', 'watch', 'shoe'],
    mascotas: ['pet', 'dog', 'cat', 'animal']
  };
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lower.includes(word))) {
      return category;
    }
  }
  
  return 'otros';
}

// Traducción básica
function translateNameToSpanish(name) {
  const translations = {
    'Men': 'Hombres', 'Women': 'Mujeres', 'Lady': 'Señora',
    'New': 'Nuevo', 'Fashion': 'Moda', 'Style': 'Estilo',
    'Set': 'Conjunto', 'Kit': 'Kit', 'Pack': 'Pack'
  };
  
  let translated = name;
  Object.entries(translations).forEach(([en, es]) => {
    translated = translated.replace(new RegExp(`\\b${en}\\b`, 'g'), es);
  });
  
  return translated;
}

// Fetch productos reales de CJ
async function fetchRealCJProducts(categoryId, limit = 20) {
  try {
    console.log(`🔍 Obteniendo ${limit} productos reales de CJ (categoría: ${categoryId})...`);
    
    let url = `${CJ_BASE_URL}/product/list?pageNum=1&pageSize=${limit}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_ACCESS_TOKEN
      }
    });
    
    const data = await response.json();
    
    if (!data.result || data.code !== 200) {
      console.error('❌ Error en API de CJ:', data.message);
      return [];
    }
    
    const products = data.data?.list || [];
    console.log(`📦 Obtenidos ${products.length} productos reales de CJ`);
    
    return products;
  } catch (error) {
    console.error('❌ Error fetching CJ products:', error);
    return [];
  }
}

// Transformar producto de CJ a formato Supabase
function transformCJProduct(cjProduct) {
  const USD_TO_CLP = 950;
  const usdPrice = parseFloat(cjProduct.sellPrice || '0');
  const clpPrice = usdPrice * USD_TO_CLP;
  
  return {
    cj_id: cjProduct.pid,
    name: cjProduct.productNameEn,
    name_es: translateNameToSpanish(cjProduct.productNameEn),
    productsku: cjProduct.productSku,
    image_url: cjProduct.productImage, // IMAGEN REAL DE CJ
    price_cents: Math.round(clpPrice),
    category_slug: mapCategory(cjProduct.categoryName),
    cj_category: cjProduct.categoryName,
    description: '',
    description_es: 'Producto importado de CJ Dropshipping',
    short_desc_es: cjProduct.productNameEn,
    long_desc_es: `${cjProduct.productNameEn} - Producto de calidad importado directamente de CJ Dropshipping.`,
    envio: 'Envío estándar',
    destacado: false,
    sales: 0,
    envio_gratis: Math.random() < 0.3,
    has_variants: false,
    has_video: false
  };
}

// Insertar productos en Supabase
async function insertProducts(products) {
  if (products.length === 0) return 0;
  
  // Filtrar productos existentes
  const cjIds = products.map(p => p.cj_id);
  const { data: existing, error: checkError } = await supabase
    .from('products')
    .select('cj_id')
    .in('cj_id', cjIds);
  
  if (checkError) {
    console.error('❌ Error verificando productos existentes:', checkError);
    return 0;
  }
  
  const existingIds = new Set(existing?.map(p => p.cj_id) || []);
  const newProducts = products.filter(p => !existingIds.has(p.cj_id));
  
  if (newProducts.length === 0) {
    console.log('⚠️ Todos los productos ya existen en la base de datos');
    return 0;
  }
  
  console.log(`🔄 Insertando ${newProducts.length} productos nuevos...`);
  
  const { error: insertError } = await supabase
    .from('products')
    .insert(newProducts);
  
  if (insertError) {
    console.error('❌ Error insertando productos:', insertError);
    return 0;
  }
  
  console.log(`✅ Insertados ${newProducts.length} productos reales de CJ`);
  return newProducts.length;
}

// Función principal para importar por categoría
async function importCategoryProducts(categoryName, cjCategoryId, limit = 20) {
  console.log(`\n🎯 IMPORTANDO ${limit} PRODUCTOS DE ${categoryName.toUpperCase()}`);
  console.log('=' .repeat(60));
  
  // Obtener productos reales de CJ
  const cjProducts = await fetchRealCJProducts(cjCategoryId, limit);
  
  if (cjProducts.length === 0) {
    console.log(`❌ No se pudieron obtener productos de CJ para ${categoryName}`);
    return 0;
  }
  
  // Transformar productos
  const transformedProducts = cjProducts.map(transformCJProduct);
  
  // Mostrar información de los productos
  console.log('\n📋 Productos obtenidos:');
  transformedProducts.slice(0, 3).forEach(p => {
    console.log(`   • ${p.name} (${p.category_slug})`);
    console.log(`     Imagen: ${p.image_url.substring(0, 50)}...`);
  });
  
  if (transformedProducts.length > 3) {
    console.log(`   ... y ${transformedProducts.length - 3} más`);
  }
  
  // Insertar en base de datos
  const inserted = await insertProducts(transformedProducts);
  return inserted;
}

// Plan de importación con IDs reales de CJ
const IMPORT_PLAN = [
  { name: 'Tecnología', cjId: '100007', limit: 30 }, // Consumer Electronics
  { name: 'Hogar', cjId: '100001', limit: 25 },      // Home & Garden  
  { name: 'Belleza', cjId: '100014', limit: 20 },     // Beauty & Health
  { name: 'Ropa', cjId: '100002', limit: 30 },        // Fashion
  { name: 'Accesorios', cjId: '100055', limit: 15 },  // Jewelry
  { name: 'Deportes', cjId: '100009', limit: 15 },    // Sports
  { name: 'Mascotas', cjId: '100017', limit: 10 }     // Pet Supplies
];

async function executeRealImportPlan() {
  console.log('🎯 PLAN DE IMPORTACIÓN DE PRODUCTOS REALES DE CJ');
  console.log('=' .repeat(70));
  console.log('Importando productos REALES con imágenes REALES de CJ Dropshipping\n');
  
  let totalImported = 0;
  
  for (const category of IMPORT_PLAN) {
    const imported = await importCategoryProducts(category.name, category.cjId, category.limit);
    totalImported += imported;
    
    // Pausa entre categorías
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Mostrar resultado final
  const { data: finalProducts, error } = await supabase
    .from('products')
    .select('category_slug');
  
  if (!error && finalProducts) {
    const counts = {};
    finalProducts.forEach(p => {
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
  
  console.log(`\n🎉 ¡IMPORTACIÓN COMPLETADA!`);
  console.log(`📊 Total productos importados: ${totalImported}`);
  console.log(`🖼️ Todos con imágenes REALES de CJ Dropshipping`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--execute')) {
    await executeRealImportPlan();
  } else {
    console.log('🎯 IMPORTADOR DE PRODUCTOS REALES DE CJ DROPSHIPPING');
    console.log('=' .repeat(60));
    console.log('Este script importará productos REALES de CJ con imágenes REALES\n');
    console.log('📋 Plan:');
    IMPORT_PLAN.forEach(cat => {
      console.log(`   • ${cat.name}: ${cat.limit} productos`);
    });
    console.log(`\n📊 Total estimado: ~${IMPORT_PLAN.reduce((sum, cat) => sum + cat.limit, 0)} productos`);
    console.log('\nPara ejecutar:');
    console.log('node scripts/import_real_cj_products.js --execute');
  }
}

main();