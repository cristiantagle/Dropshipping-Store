const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Datos de muestra para importar productos de tecnología 
const SAMPLE_ELECTRONICS_PRODUCTS = [
  {
    pid: "tech001",
    productNameEn: "Wireless Bluetooth Headphones Premium Sound Quality",
    productSku: "WBH-001",
    productImage: "https://example.com/headphones.jpg",
    sellPrice: "29.99",
    categoryName: "Consumer Electronics"
  },
  {
    pid: "tech002", 
    productNameEn: "Smart Fitness Tracker with Heart Rate Monitor",
    productSku: "SFT-002",
    productImage: "https://example.com/fitness-tracker.jpg",
    sellPrice: "49.99",
    categoryName: "Consumer Electronics"
  },
  {
    pid: "tech003",
    productNameEn: "USB-C Fast Charging Cable 6ft Durable Design",
    productSku: "UCC-003", 
    productImage: "https://example.com/usb-cable.jpg",
    sellPrice: "12.99",
    categoryName: "Cell Phone Accessories"
  },
  {
    pid: "tech004",
    productNameEn: "Portable Power Bank 10000mAh Quick Charge",
    productSku: "PPB-004",
    productImage: "https://example.com/power-bank.jpg", 
    sellPrice: "19.99",
    categoryName: "Consumer Electronics"
  },
  {
    pid: "tech005",
    productNameEn: "Wireless Phone Charger Pad Fast Charging Station",
    productSku: "WPC-005",
    productImage: "https://example.com/wireless-charger.jpg",
    sellPrice: "24.99", 
    categoryName: "Consumer Electronics"
  }
];

// Datos de muestra para mascotas
const SAMPLE_PET_PRODUCTS = [
  {
    pid: "pet001",
    productNameEn: "Interactive Dog Puzzle Toy Mental Stimulation",
    productSku: "IDT-001",
    productImage: "https://example.com/dog-puzzle.jpg",
    sellPrice: "18.99",
    categoryName: "Pet Supplies"
  },
  {
    pid: "pet002",
    productNameEn: "Cat Scratching Post with Sisal Rope Tower",
    productSku: "CSP-002",
    productImage: "https://example.com/cat-scratcher.jpg", 
    sellPrice: "34.99",
    categoryName: "Pet Supplies"
  },
  {
    pid: "pet003",
    productNameEn: "Premium Dog Leash Retractable 16ft Heavy Duty",
    productSku: "PDL-003",
    productImage: "https://example.com/dog-leash.jpg",
    sellPrice: "22.99",
    categoryName: "Pet Supplies"
  }
];

// Datos de muestra para bienestar
const SAMPLE_WELLNESS_PRODUCTS = [
  {
    pid: "wel001", 
    productNameEn: "Yoga Mat Non-Slip Exercise Fitness Pilates",
    productSku: "YMT-001",
    productImage: "https://example.com/yoga-mat.jpg",
    sellPrice: "25.99",
    categoryName: "Sports & Entertainment"
  },
  {
    pid: "wel002",
    productNameEn: "Resistance Bands Set Workout Equipment Home Gym",
    productSku: "RBS-002", 
    productImage: "https://example.com/resistance-bands.jpg",
    sellPrice: "16.99",
    categoryName: "Sports & Entertainment"
  },
  {
    pid: "wel003",
    productNameEn: "Essential Oils Aromatherapy Diffuser Set Relaxation",
    productSku: "EOD-003",
    productImage: "https://example.com/oil-diffuser.jpg",
    sellPrice: "32.99",
    categoryName: "Health & Beauty"
  }
];

// Función para mapear categorías (simplificada basada en tu cj_config)
function mapCategory(cjCategory) {
  if (!cjCategory) return 'otros';
  
  const lower = cjCategory.toLowerCase();
  
  // Mapeo directo basado en palabras clave
  if (lower.includes('electronic') || lower.includes('phone') || lower.includes('computer')) {
    return 'tecnologia';
  }
  if (lower.includes('pet')) {
    return 'mascotas'; 
  }
  if (lower.includes('sport') || lower.includes('fitness') || lower.includes('health')) {
    return 'bienestar';
  }
  if (lower.includes('beauty')) {
    return 'belleza';
  }
  
  return 'otros';
}

// Función para traducir nombres básicamente
function translateNameToSpanish(name) {
  const dictionary = {
    "Wireless": "Inalámbrico",
    "Bluetooth": "Bluetooth", 
    "Headphones": "Auriculares",
    "Premium": "Premium",
    "Sound": "Sonido",
    "Quality": "Calidad",
    "Smart": "Inteligente",
    "Fitness": "Fitness",
    "Tracker": "Rastreador",
    "Heart": "Corazón",
    "Rate": "Frecuencia",
    "Monitor": "Monitor",
    "Fast": "Rápido",
    "Charging": "Carga",
    "Cable": "Cable",
    "Durable": "Duradero",
    "Design": "Diseño",
    "Portable": "Portátil",
    "Power": "Poder",
    "Bank": "Banco",
    "Quick": "Rápida",
    "Charge": "Carga",
    "Phone": "Teléfono",
    "Charger": "Cargador",
    "Pad": "Almohadilla",
    "Station": "Estación",
    "Interactive": "Interactivo",
    "Dog": "Perro",
    "Puzzle": "Rompecabezas", 
    "Toy": "Juguete",
    "Mental": "Mental",
    "Stimulation": "Estimulación",
    "Cat": "Gato",
    "Scratching": "Rascador",
    "Post": "Poste",
    "Tower": "Torre",
    "Leash": "Correa",
    "Heavy": "Pesado",
    "Duty": "Servicio",
    "Yoga": "Yoga",
    "Mat": "Colchoneta",
    "Exercise": "Ejercicio",
    "Pilates": "Pilates",
    "Resistance": "Resistencia",
    "Bands": "Bandas",
    "Set": "Conjunto",
    "Workout": "Entrenamiento",
    "Equipment": "Equipo",
    "Home": "Hogar",
    "Gym": "Gimnasio",
    "Essential": "Esencial",
    "Oils": "Aceites",
    "Aromatherapy": "Aromaterapia",
    "Diffuser": "Difusor",
    "Relaxation": "Relajación"
  };
  
  let translated = name;
  for (const [en, es] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, es);
  }
  
  return translated;
}

// Función para transformar productos de CJ a formato Supabase
function transformCJProduct(raw) {
  const USD_TO_CLP = 950; // Tasa de conversión
  const usdPrice = parseFloat(raw.sellPrice);
  const clpPrice = usdPrice * USD_TO_CLP;
  
  return {
    cj_id: raw.pid,
    name: raw.productNameEn,
    name_es: translateNameToSpanish(raw.productNameEn),
    productsku: raw.productSku,
    image_url: raw.productImage,
    price_cents: Math.round(clpPrice),
    category_slug: mapCategory(raw.categoryName),
    cj_category: raw.categoryName,
    // Campos adicionales requeridos
    description: '',
    description_es: 'Producto importado de CJ Dropshipping con traducción automática.',
    short_desc_es: 'Excelente producto importado.',
    long_desc_es: 'Descripción detallada del producto importado de CJ Dropshipping.',
    envio: 'Envío estándar',
    destacado: false,
    sales: 0,
    envio_gratis: false,
    has_variants: false,
    has_video: false
  };
}

async function insertProducts(products, categoryName) {
  console.log(`\n📦 Insertando ${products.length} productos de ${categoryName}...`);
  
  // Transformar productos
  const transformedProducts = products.map(transformCJProduct);
  
  // Verificar productos existentes
  const cjIds = transformedProducts.map(p => p.cj_id);
  const { data: existing, error: checkError } = await supabase
    .from('products')
    .select('cj_id')
    .in('cj_id', cjIds);
    
  if (checkError) {
    console.error('❌ Error verificando productos existentes:', checkError);
    return false;
  }
  
  const existingIds = new Set((existing || []).map(p => p.cj_id));
  const newProducts = transformedProducts.filter(p => !existingIds.has(p.cj_id));
  
  if (newProducts.length === 0) {
    console.log(`⚠️ Todos los productos de ${categoryName} ya existen en la base de datos`);
    return true;
  }
  
  console.log(`🔄 Insertando ${newProducts.length} productos nuevos de ${categoryName}...`);
  
  // Mostrar debug de categorías
  const categories = [...new Set(newProducts.map(p => p.category_slug))];
  console.log(`🏷️ Categorías asignadas: ${categories.join(', ')}`);
  
  // Insertar productos
  const { error: insertError } = await supabase
    .from('products')
    .insert(newProducts);
    
  if (insertError) {
    console.error(`❌ Error insertando productos de ${categoryName}:`, insertError);
    return false;
  }
  
  console.log(`✅ Insertados ${newProducts.length} productos de ${categoryName}`);
  return true;
}

async function executeBalancedImport() {
  console.log('🎯 EJECUTANDO IMPORTACIÓN BALANCEADA');
  console.log('=' .repeat(50));
  console.log('Importando productos de muestra para balancear el inventario\n');
  
  let totalImported = 0;
  
  // 1. Importar productos de tecnología
  console.log('1️⃣ IMPORTANDO PRODUCTOS DE TECNOLOGÍA');
  const techSuccess = await insertProducts(SAMPLE_ELECTRONICS_PRODUCTS, 'Tecnología');
  if (techSuccess) totalImported += SAMPLE_ELECTRONICS_PRODUCTS.length;
  
  // 2. Importar productos de mascotas  
  console.log('\n2️⃣ IMPORTANDO PRODUCTOS DE MASCOTAS');
  const petSuccess = await insertProducts(SAMPLE_PET_PRODUCTS, 'Mascotas');
  if (petSuccess) totalImported += SAMPLE_PET_PRODUCTS.length;
  
  // 3. Importar productos de bienestar
  console.log('\n3️⃣ IMPORTANDO PRODUCTOS DE BIENESTAR');
  const wellnessSuccess = await insertProducts(SAMPLE_WELLNESS_PRODUCTS, 'Bienestar');
  if (wellnessSuccess) totalImported += SAMPLE_WELLNESS_PRODUCTS.length;
  
  // Mostrar resumen final
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMEN DE IMPORTACIÓN:');
  console.log(`✅ Total de productos procesados: ${totalImported}`);
  
  // Verificar nueva distribución
  console.log('\n🔍 Verificando nueva distribución de categorías...');
  const { data: allProducts, error } = await supabase
    .from('products')
    .select('category_slug');
    
  if (!error && allProducts) {
    const categoryCounts = {};
    allProducts.forEach(product => {
      categoryCounts[product.category_slug] = (categoryCounts[product.category_slug] || 0) + 1;
    });
    
    console.log('\n📈 NUEVA DISTRIBUCIÓN POR CATEGORÍAS:');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`${category.padEnd(15)} | ${count.toString().padStart(3)} productos`);
      });
  }
  
  console.log('\n🎉 ¡Importación balanceada completada!');
  console.log('💡 Recomendación: Refrescar el frontend para ver los nuevos productos');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  executeBalancedImport().catch(console.error);
}

module.exports = {
  executeBalancedImport
};