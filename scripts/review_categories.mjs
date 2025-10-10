import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 REVISIÓN DE CATEGORIZACIÓN ERRÓNEA\n');

if (!url || !key) {
  console.error('❌ Faltan variables de entorno.');
  process.exit(1);
}

const supabase = createClient(url, key);

// Palabras clave para detectar ropa de mujer
const WOMEN_KEYWORDS = [
  'women', 'woman', 'ladies', 'lady', 'female', 'girl', 'girls',
  'dress', 'skirt', 'blouse', 'gown', 'camisole', 'leggings', 
  'romper', 'bra', 'lingerie', 'heels', 'purse', 'handbag',
  'mujeres', 'mujer', 'dama', 'señora', 'femenino', 'chica',
  'vestido', 'falda', 'blusa'
];

// Palabras clave para productos que NO son ropa
const NON_CLOTHING_KEYWORDS = [
  'home', 'house', 'kitchen', 'storage', 'organizer', 'cleaning',
  'tool', 'gadget', 'electronic', 'tech', 'phone', 'camera',
  'health', 'beauty', 'skincare', 'makeup', 'pet', 'dog', 'cat',
  'hogar', 'casa', 'cocina', 'limpieza', 'herramienta', 'tecnologia',
  'salud', 'belleza', 'mascota', 'perro', 'gato'
];

try {
  // Obtener productos de ropa_hombre
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, name_es, category_slug, cj_category')
    .eq('category_slug', 'ropa_hombre')
    .order('name');

  if (error) throw error;

  console.log(`📊 Total productos en ROPA_HOMBRE: ${products.length}\n`);

  let womenProducts = [];
  let nonClothingProducts = [];
  let suspiciousProducts = [];

  products.forEach(product => {
    const nameText = `${product.name} ${product.name_es || ''}`.toLowerCase();
    
    // Detectar productos de mujer
    const hasWomenKeywords = WOMEN_KEYWORDS.some(keyword => nameText.includes(keyword));
    if (hasWomenKeywords) {
      womenProducts.push({
        id: product.id,
        name: product.name,
        name_es: product.name_es,
        cj_category: product.cj_category,
        reason: 'Contiene palabras de mujer'
      });
    }
    
    // Detectar productos que no son ropa
    const hasNonClothingKeywords = NON_CLOTHING_KEYWORDS.some(keyword => nameText.includes(keyword));
    if (hasNonClothingKeywords) {
      nonClothingProducts.push({
        id: product.id,
        name: product.name,
        name_es: product.name_es,
        cj_category: product.cj_category,
        reason: 'No parece ser ropa'
      });
    }

    // Detectar otros patrones sospechosos
    if (nameText.includes('toe') || nameText.includes('foot') || nameText.includes('nail')) {
      suspiciousProducts.push({
        id: product.id,
        name: product.name,
        name_es: product.name_es,
        cj_category: product.cj_category,
        reason: 'Posible producto de belleza/salud'
      });
    }
  });

  // Mostrar resultados
  if (womenProducts.length > 0) {
    console.log('🚨 PRODUCTOS DE MUJER MAL CATEGORIZADOS:');
    console.log(`   Encontrados: ${womenProducts.length}\n`);
    
    womenProducts.forEach((product, index) => {
      console.log(`${index + 1}. "${product.name}"`);
      if (product.name_es) console.log(`   ES: "${product.name_es}"`);
      console.log(`   CJ Original: "${product.cj_category}"`);
      console.log(`   Razón: ${product.reason}`);
      console.log(`   ID: ${product.id}\n`);
    });
  }

  if (nonClothingProducts.length > 0) {
    console.log('🏠 PRODUCTOS QUE NO SON ROPA:');
    console.log(`   Encontrados: ${nonClothingProducts.length}\n`);
    
    nonClothingProducts.forEach((product, index) => {
      console.log(`${index + 1}. "${product.name}"`);
      if (product.name_es) console.log(`   ES: "${product.name_es}"`);
      console.log(`   CJ Original: "${product.cj_category}"`);
      console.log(`   Razón: ${product.reason}`);
      console.log(`   ID: ${product.id}\n`);
    });
  }

  if (suspiciousProducts.length > 0) {
    console.log('🤔 PRODUCTOS SOSPECHOSOS (POSIBLE OTRA CATEGORÍA):');
    console.log(`   Encontrados: ${suspiciousProducts.length}\n`);
    
    suspiciousProducts.forEach((product, index) => {
      console.log(`${index + 1}. "${product.name}"`);
      if (product.name_es) console.log(`   ES: "${product.name_es}"`);
      console.log(`   CJ Original: "${product.cj_category}"`);
      console.log(`   Razón: ${product.reason}`);
      console.log(`   ID: ${product.id}\n`);
    });
  }

  // Resumen
  const totalProblems = womenProducts.length + nonClothingProducts.length + suspiciousProducts.length;
  const correctMenProducts = products.length - totalProblems;
  
  console.log('🎯 RESUMEN:');
  console.log(`   Total revisados: ${products.length}`);
  console.log(`   Productos correctos (ropa hombre): ${correctMenProducts}`);
  console.log(`   Productos mal categorizados: ${totalProblems}`);
  console.log(`   - Ropa de mujer: ${womenProducts.length}`);
  console.log(`   - No es ropa: ${nonClothingProducts.length}`);
  console.log(`   - Otros sospechosos: ${suspiciousProducts.length}`);
  
  if (totalProblems > 0) {
    console.log(`\n💡 RECOMENDACIÓN: Reclasificar ${totalProblems} productos mal categorizados`);
  }

} catch (e) {
  console.error('❌ Error:', e?.message ?? e);
  process.exit(1);
}