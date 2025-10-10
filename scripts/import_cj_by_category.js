const { createClient } = require('@supabase/supabase-js');
const https = require('https');
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

// Mapeo de categorías CJ a nuestras categorías (usando tu sistema exacto)
const CJ_CATEGORIES = {
  // Tecnología y Electrónicos
  electronics: "100007",    // Consumer Electronics
  phones: "100099",        // Mobile Phones
  computers: "100003",     // Computer & Accessories
  gadgets: "100012",       // Electronics Gadgets
  
  // Belleza y Cuidado Personal
  beauty: "100014",        // Beauty & Health
  skincare: "100090",      // Skin Care
  makeup: "100091",        // Makeup
  health: "100015",        // Healthcare
  
  // Hogar y Jardín
  home: "100001",          // Home & Garden
  kitchen: "100025",       // Kitchen & Dining
  furniture: "100026",     // Furniture
  garden: "100028",        // Garden Supplies
  
  // Deportes y Fitness
  sports: "100009",        // Sports & Entertainment
  fitness: "100087",       // Fitness Equipment
  outdoor: "100088",       // Outdoor Activities
  
  // Mascotas
  pets: "100017",          // Pet Supplies
  
  // Moda
  fashion: "100002",       // Fashion
  bags: "100054",          // Bags & Luggage
  jewelry: "100055",       // Jewelry & Accessories
  watches: "100056"        // Watches
};

// Función para hacer request HTTPS sin dependencias externas
function httpsRequest(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
  });
}

// Mapeo de categorías (copiado exacto de tu cj_config.ts)
function mapCategory(cjCategory) {
  if (!cjCategory) return 'otros';
  
  const lower = cjCategory.toLowerCase();
  
  // Usar las mismas palabras clave que tienes en tu sistema
  const keywords = {
    hogar: ['house', 'home', 'kitchen', 'cook', 'pan', 'pot', 'knife', 'fork', 'spoon', 'plate', 'bowl', 'cup', 'glass', 'mug', 'furniture', 'chair', 'table', 'sofa', 'bed', 'pillow', 'blanket', 'sheet', 'curtain', 'lamp', 'light', 'bulb', 'storage', 'organizer', 'cleaning', 'broom', 'mop', 'vacuum', 'bath', 'toilet', 'shower', 'towel', 'mirror', 'decoration', 'candle', 'frame', 'rug', 'carpet', 'mat', 'shelf', 'drawer', 'closet'],
    belleza: ['beauty', 'makeup', 'cosmetic', 'lipstick', 'lip gloss', 'foundation', 'concealer', 'powder', 'blush', 'eyeshadow', 'mascara', 'eyeliner', 'nail', 'polish', 'manicure', 'pedicure', 'skincare', 'cream', 'lotion', 'serum', 'toner', 'cleanser', 'mask', 'perfume', 'fragrance', 'shampoo', 'conditioner', 'hair', 'wig', 'extension', 'comb', 'brush', 'mirror', 'spa', 'facial', 'gel', 'oil', 'sunscreen'],
    bienestar: ['wellness', 'health', 'fitness', 'yoga', 'pilates', 'exercise', 'gym', 'workout', 'training', 'dumbbell', 'barbell', 'weight', 'resistance band', 'mat', 'massage', 'therapy', 'relax', 'meditation', 'mindfulness', 'supplement', 'vitamin', 'protein', 'herbal', 'essential oil', 'aromatherapy', 'first aid', 'bandage', 'brace', 'support', 'posture', 'sleep', 'rest'],
    tecnologia: ['tech', 'technology', 'gadget', 'device', 'smart', 'phone', 'iphone', 'android', 'tablet', 'laptop', 'notebook', 'computer', 'pc', 'desktop', 'monitor', 'keyboard', 'mouse', 'usb', 'cable', 'charger', 'adapter', 'battery', 'power bank', 'earphone', 'headphone', 'speaker', 'bluetooth', 'wireless', 'camera', 'webcam', 'microphone', 'drone', 'watch', 'smartwatch', 'console', 'gaming', 'controller', 'vr', 'projector', 'printer', 'scanner'],
    ropa_hombre: ['men', 'male', 'jacket', 'blazer', 'suit', 'shirt', 'sweater', 'hoodie', 'trousers', 'pants', 'jeans', 'coat', 'parka', 'vest', 'shorts'],
    ropa_mujer: ['women', 'woman', 'lady', 'dress', 'skirt', 'blouse', 'top', 'camisole', 'leggings', 'romper', 'gown', 'sweater', 'hoodie', 'trench', 'vest'],
    accesorios: ['earring', 'necklace', 'pendant', 'ring', 'jewelry', 'bracelet', 'watch', 'backpack', 'bag', 'purse', 'handbag', 'wallet', 'belt', 'cap', 'hat', 'scarf', 'glove', 'shoe', 'sandal', 'boot', 'flat', 'pump', 'sneaker'],
    mascotas: ['pet', 'dog', 'cat', 'puppy', 'kitten', 'hamster', 'rabbit', 'bird', 'parrot', 'fish', 'aquarium', 'reptile', 'turtle', 'snake', 'lizard', 'leash', 'collar', 'harness', 'toy', 'bone', 'treat', 'food', 'bowl', 'kennel', 'bed', 'scratcher', 'litter', 'grooming', 'shampoo', 'brush', 'claw', 'nail', 'carrier', 'cage']
  };
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lower.includes(word))) {
      return category;
    }
  }
  
  return 'otros';
}

// Traducción (copiado de tu sistema)
function translateNameToSpanish(name) {
  const dictionary = {
    "Household": "Hogar", "Desk": "Escritorio", "Lamp": "Lámpara", "Bag": "Bolso", "Dress": "Vestido",
    "Ring": "Anillo", "Bracelet": "Pulsera", "Pearl": "Perla", "Christmas": "Navidad", "Girls": "Niñas",
    "Men's": "Hombres", "Women's": "Mujeres", "Outdoor": "Exterior", "Fashion": "Moda", "New": "Nuevo"
  };

  let translated = name;
  for (const [en, es] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, es);
  }
  return translated;
}

// Transformar producto (exacto de tu sistema)
function transformCJProduct(raw) {
  const USD_TO_CLP = parseFloat(process.env.USD_TO_CLP || "950");
  const usdPrice = parseFloat(raw.sellPrice || '0');
  const clpPrice = usdPrice * USD_TO_CLP;

  return {
    cj_id: raw.pid,
    name: raw.productNameEn,
    name_es: translateNameToSpanish(raw.productNameEn),
    productsku: raw.productSku,
    image_url: raw.productImage, // IMAGEN REAL DE CJ
    price_cents: Math.round(clpPrice),
    category_slug: mapCategory(raw.categoryName),
    cj_category: raw.categoryName,
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

// Importar productos por categoría
async function importByCategory(categoryName, limit = 50) {
  const categoryId = CJ_CATEGORIES[categoryName];
  
  if (!categoryId) {
    console.error(`❌ Categoría "${categoryName}" no encontrada.`);
    console.log('Categorías disponibles:', Object.keys(CJ_CATEGORIES).join(', '));
    return;
  }

  console.log(`🎯 Importando ${limit} productos de categoría: ${categoryName} (ID: ${categoryId})\n`);
  
  try {
    // Obtener productos de CJ
    const url = `${CJ_BASE_URL}/product/list?pageNum=1&pageSize=${limit}&categoryId=${categoryId}`;
    console.log('🔍 Obteniendo productos de CJ...');
    
    const data = await httpsRequest(url, {
      'Content-Type': 'application/json',
      'CJ-Access-Token': CJ_ACCESS_TOKEN
    });

    if (!data.result || data.code !== 200) {
      console.error('❌ Error en API de CJ:', data.message);
      return;
    }

    const productos = data.data?.list || [];
    console.log(`📦 Obtenidos ${productos.length} productos de CJ`);

    if (productos.length === 0) {
      console.warn("⚠️ No se recibieron productos de CJ");
      return;
    }

    // Transformar productos
    const transformedAll = productos.map(transformCJProduct);

    // Filtrar existentes
    const ids = transformedAll.map(p => p.cj_id);
    const { data: existentes, error: errExist } = await supabase
      .from("products")
      .select("cj_id")
      .in("cj_id", ids);

    if (errExist) {
      console.error("❌ Error consultando existentes:", errExist.message);
      return;
    }

    const setExistentes = new Set((existentes ?? []).map(r => r.cj_id));
    const toInsert = transformedAll.filter(p => !setExistentes.has(p.cj_id));
    console.log(`🧹 Omitiendo existentes: ${setExistentes.size}. A insertar: ${toInsert.length}.`);

    if (toInsert.length === 0) {
      console.log("✅ No hay nuevos productos para insertar.");
      return;
    }

    // Debug de categorías
    const uniqueSlugs = [...new Set(toInsert.map(p => p.category_slug))];
    console.log("🔎 Categorías asignadas:", uniqueSlugs);

    // Insertar en la base de datos
    const { error: insertErr } = await supabase
      .from("products")
      .insert(toInsert);

    if (insertErr) {
      console.error("❌ Error insertando productos:", insertErr.message);
      return;
    }

    console.log(`✅ Insertados ${toInsert.length} productos REALES de CJ.`);

    // Mostrar algunos ejemplos
    console.log('\n📋 Ejemplos insertados:');
    toInsert.slice(0, 3).forEach(p => {
      console.log(`   • ${p.name} (${p.category_slug})`);
      console.log(`     💰 $${(p.price_cents/100).toLocaleString()}`);
    });

  } catch (error) {
    console.error('❌ Error en importación:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('🎯 IMPORTADOR DE CATEGORÍAS ESPECÍFICAS CJ\n');
    console.log('Uso: node import_cj_by_category.js <categoria> [limite]\n');
    console.log('Categorías disponibles:');
    Object.entries(CJ_CATEGORIES).forEach(([name, id]) => {
      console.log(`  ${name} (ID: ${id})`);
    });
    console.log('\nEjemplos:');
    console.log('  node scripts/import_cj_by_category.js electronics 30');
    console.log('  node scripts/import_cj_by_category.js beauty 20');
    console.log('  node scripts/import_cj_by_category.js pets 15');
    return;
  }

  const categoryName = args[0];
  const limit = parseInt(args[1] || '30');
  
  await importByCategory(categoryName, limit);
}

main();