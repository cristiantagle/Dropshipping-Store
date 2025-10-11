import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Leer variables de entorno desde .env
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de Supabase en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Analizando precios de productos...\n');

try {
  // Obtener algunos productos para analizar precios
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, name_es, price_cents, category_slug')
    .limit(10);

  if (error) {
    console.error('❌ Error obteniendo productos:', error.message);
    process.exit(1);
  }

  console.log(`📊 Encontrados ${products.length} productos:\n`);

  // Configuración actual de precios
  const USD_TO_CLP = Number(envVars.NEXT_PUBLIC_USD_TO_CLP) || 950;
  const MARKUP = Number(envVars.NEXT_PUBLIC_MARKUP) || 1.3;

  console.log(`⚙️ Configuración actual:`);
  console.log(`   USD_TO_CLP: ${USD_TO_CLP}`);
  console.log(`   MARKUP: ${MARKUP}`);
  console.log(`   Variables definidas: ${envVars.NEXT_PUBLIC_USD_TO_CLP ? '✅' : '❌'} USD_TO_CLP, ${envVars.NEXT_PUBLIC_MARKUP ? '✅' : '❌'} MARKUP\n`);

  products.forEach((product, index) => {
    const priceInDollars = product.price_cents / 100;
    const priceInCLP = priceInDollars * USD_TO_CLP;
    const finalPrice = priceInCLP * MARKUP;
    
    console.log(`${index + 1}. ${product.name_es || product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Categoría: ${product.category_slug || 'sin categoría'}`);
    console.log(`   price_cents: ${product.price_cents}`);
    console.log(`   USD: $${priceInDollars.toFixed(2)}`);
    console.log(`   CLP sin markup: $${priceInCLP.toLocaleString('es-CL')}`);
    console.log(`   CLP final: $${Math.round(finalPrice).toLocaleString('es-CL')}`);
    console.log('');
  });

  // Estadísticas generales
  const { data: stats, error: statsError } = await supabase
    .from('products')
    .select('price_cents');

  if (!statsError && stats) {
    const prices = stats.map(p => p.price_cents).sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const avg = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    
    console.log(`📈 Estadísticas generales (${stats.length} productos):`);
    console.log(`   Precio mínimo: ${min} cents ($${(min/100).toFixed(2)} USD)`);
    console.log(`   Precio máximo: ${max} cents ($${(max/100).toFixed(2)} USD)`);
    console.log(`   Precio promedio: ${avg} cents ($${(avg/100).toFixed(2)} USD)`);
    
    const minCLP = Math.round((min/100) * USD_TO_CLP * MARKUP);
    const maxCLP = Math.round((max/100) * USD_TO_CLP * MARKUP);
    const avgCLP = Math.round((avg/100) * USD_TO_CLP * MARKUP);
    
    console.log(`\n💰 Precios en CLP (con markup ${MARKUP}):`);
    console.log(`   Mínimo: $${minCLP.toLocaleString('es-CL')}`);
    console.log(`   Máximo: $${maxCLP.toLocaleString('es-CL')}`);
    console.log(`   Promedio: $${avgCLP.toLocaleString('es-CL')}`);
  }

} catch (err) {
  console.error('❌ Error:', err.message);
}