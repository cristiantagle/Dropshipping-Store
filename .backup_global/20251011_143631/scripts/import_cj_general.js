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

// Función para hacer request HTTPS
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

// Función de mapeo mejorada y más precisa
function mapCategory(cjCategory, productName) {
  const name = (productName || '').toLowerCase();
  const category = (cjCategory || '').toLowerCase();
  
  // 1. ROPA MUJER - Patrones muy específicos
  if (
    name.includes("women's") || name.includes('woman') || name.includes('lady') || name.includes('ladies') ||
    name.includes('dress') || name.includes('skirt') || name.includes('blouse') || name.includes('bra') ||
    name.includes('lingerie') || (name.includes('girls') && !name.includes('for girls')) ||
    name.includes('female')
  ) {
    return 'ropa_mujer';
  }
  
  // 2. ROPA HOMBRE - Patrones específicos
  if (
    name.includes("men's") || name.includes('male') || name.includes('gentleman') ||
    (name.includes('suit') && (name.includes('men') || name.includes('male'))) ||
    (name.includes('tie') && !name.includes('bow tie')) || name.includes('masculine')
  ) {
    return 'ropa_hombre';
  }
  
  // 3. BELLEZA - Patrones muy específicos
  if (
    name.includes('lipstick') || name.includes('makeup') || name.includes('cosmetic') ||
    name.includes('foundation') || name.includes('mascara') || name.includes('eyeliner') ||
    name.includes('eyeshadow') || name.includes('moisturizing') || name.includes('skincare') ||
    name.includes('beauty') || name.includes('perfume') || name.includes('fragrance') ||
    name.includes('shampoo') || name.includes('conditioner') || name.includes('nail polish') ||
    name.includes('face cream') || name.includes('serum')
  ) {
    return 'belleza';
  }
  
  // 4. TECNOLOGÍA - Patrones específicos
  if (
    name.includes('phone') || name.includes('computer') || name.includes('laptop') ||
    name.includes('tablet') || name.includes('charger') || name.includes('cable') ||
    name.includes('bluetooth') || name.includes('wireless') || name.includes('headphone') ||
    name.includes('earphone') || name.includes('speaker') || name.includes('mouse') ||
    name.includes('keyboard') || name.includes('monitor') || name.includes('electronic') ||
    name.includes('smart watch') || name.includes('smartwatch') || name.includes('power bank') ||
    name.includes('usb')
  ) {
    return 'tecnologia';
  }
  
  // 5. MASCOTAS - Patrones específicos
  if (
    name.includes('pet') || name.includes('dog') || name.includes('cat') ||
    name.includes('puppy') || name.includes('kitten') || name.includes('bird') ||
    name.includes('fish') || name.includes('pet supplies') || name.includes('pet food') ||
    name.includes('pet toy') || name.includes('leash') || name.includes('collar') ||
    name.includes('pet bed')
  ) {
    return 'mascotas';
  }
  
  // 6. BIENESTAR - Patrones específicos
  if (
    name.includes('fitness') || name.includes('yoga') || name.includes('exercise') ||
    name.includes('workout') || name.includes('gym') || name.includes('massage') ||
    name.includes('wellness') || name.includes('meditation') || name.includes('health') ||
    name.includes('vitamin') || name.includes('supplement') || name.includes('therapy') ||
    name.includes('sports') || name.includes('running') || name.includes('training')
  ) {
    return 'bienestar';
  }
  
  // 7. ACCESORIOS - Patrones específicos
  if (
    name.includes('jewelry') || name.includes('necklace') || name.includes('bracelet') ||
    name.includes('ring') || name.includes('earring') || name.includes('watch') ||
    name.includes('bag') || name.includes('purse') || name.includes('wallet') ||
    name.includes('belt') || name.includes('hat') || name.includes('cap') ||
    name.includes('scarf') || name.includes('glove') || name.includes('sunglasses') ||
    name.includes('shoes') || name.includes('boots') || name.includes('sandals') ||
    name.includes('sneakers')
  ) {
    return 'accesorios';
  }
  
  // 8. HOGAR - Patrones específicos
  if (
    name.includes('home') || name.includes('house') || name.includes('kitchen') ||
    name.includes('lamp') || name.includes('light') || name.includes('furniture') ||
    name.includes('chair') || name.includes('table') || name.includes('storage') ||
    name.includes('organizer') || name.includes('decoration') || name.includes('candle') ||
    name.includes('vase') || name.includes('mirror') || name.includes('curtain') ||
    name.includes('pillow') || name.includes('blanket') || name.includes('towel') ||
    name.includes('rug') || name.includes('carpet') || name.includes('cleaning') ||
    name.includes('bathroom') || name.includes('bedroom') || name.includes('living room')
  ) {
    return 'hogar';
  }
  
  // 9. Patrones de ropa genéricos (cuando no se puede determinar el género)
  if (
    name.includes('sweater') || name.includes('hoodie') || name.includes('jacket') ||
    name.includes('coat') || name.includes('pants') || name.includes('trousers') ||
    name.includes('jeans') || name.includes('shirt') || name.includes('vest') ||
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

// Traducción (tu sistema)
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

// Transformar producto
function transformCJProduct(raw) {
  const USD_TO_CLP = parseFloat(process.env.USD_TO_CLP || "950");
  const usdPrice = parseFloat(raw.sellPrice || '0');
  const clpPrice = usdPrice * USD_TO_CLP;

  return {
    cj_id: raw.pid,
    name: raw.productNameEn,
    name_es: translateNameToSpanish(raw.productNameEn),
    productsku: raw.productSku,
    image_url: raw.productImage,
    price_cents: Math.round(clpPrice),
    category_slug: mapCategory(raw.categoryName, raw.productNameEn),
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

async function importGeneralProducts(limit = 50, page = 1) {
  console.log(`🎯 Importando ${limit} productos REALES de CJ (página ${page})\n`);
  
  try {
    // Obtener productos generales de CJ sin filtro de categoría
    const url = `${CJ_BASE_URL}/product/list?pageNum=${page}&pageSize=${limit}`;
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

    // Mostrar distribución por categorías
    const categoryCounts = {};
    toInsert.forEach(p => {
      categoryCounts[p.category_slug] = (categoryCounts[p.category_slug] || 0) + 1;
    });

    console.log("🔎 Distribución de categorías a insertar:");
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} productos`);
      });

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
    toInsert.slice(0, 5).forEach(p => {
      console.log(`   • ${p.name} (${p.category_slug})`);
      console.log(`     💰 $${(p.price_cents/100).toLocaleString()}`);
      console.log(`     📷 ${p.image_url.substring(0, 60)}...`);
    });

    return toInsert.length;
  } catch (error) {
    console.error('❌ Error en importación:', error);
    return 0;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const limit = parseInt(args[0] || '30');
  const page = parseInt(args[1] || '1');
  
  console.log('🎯 IMPORTADOR GENERAL DE PRODUCTOS REALES DE CJ');
  console.log('=' .repeat(60));
  console.log('Importará productos reales y los clasificará automáticamente\n');
  
  const imported = await importGeneralProducts(limit, page);
  
  if (imported > 0) {
    // Mostrar nueva distribución
    const { data: allProducts } = await supabase
      .from('products')
      .select('category_slug');

    if (allProducts) {
      const totalCounts = {};
      allProducts.forEach(p => {
        totalCounts[p.category_slug] = (totalCounts[p.category_slug] || 0) + 1;
      });

      console.log('\n📊 NUEVA DISTRIBUCIÓN TOTAL:');
      console.log('=' .repeat(40));
      Object.entries(totalCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
          console.log(`${cat.padEnd(15)} | ${count.toString().padStart(3)} productos`);
        });
    }
  }
}

main();