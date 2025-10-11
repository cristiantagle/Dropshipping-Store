// fix_prices.ts
// Script para corregir precios existentes en la base de datos
// Multiplica todos los price_cents por 100 para convertir de CLP a centavos

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPrices() {
  try {
    console.log('🔧 Corrigiendo precios en la base de datos...');
    
    // Obtener todos los productos
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, price_cents, name');
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!products || products.length === 0) {
      console.log('❌ No se encontraron productos en la base de datos');
      return;
    }
    
    console.log(`📊 Se encontraron ${products.length} productos`);
    
    // Mostrar algunos ejemplos de precios actuales
    console.log('📋 Ejemplos de precios actuales:');
    products.slice(0, 5).forEach(product => {
      console.log(`  - ${product.name}: $${product.price_cents} → $${product.price_cents * 100}`);
    });
    
    // Actualizar todos los precios multiplicando por 100
    const updates = products.map(product => ({
      id: product.id,
      price_cents: product.price_cents * 100
    }));
    
    console.log('🚀 Aplicando correcciones...');
    
    // Actualizar en lotes de 100
    const batchSize = 100;
    let updated = 0;
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      // Actualizar solo el campo price_cents para cada producto
      for (const update of batch) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ price_cents: update.price_cents })
          .eq('id', update.id);
        
        if (updateError) {
          console.error(`❌ Error actualizando producto ${update.id}:`, updateError);
          continue;
        }
        
        updated++;
      }
      
      console.log(`✅ Actualizados ${updated}/${products.length} productos`);
    }
    
    console.log('🎉 ¡Corrección completada exitosamente!');
    console.log(`📊 Total de productos actualizados: ${updated}`);
    
  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  }
}

// Ejecutar el script
if (require.main === module) {
  fixPrices().then(() => process.exit(0));
}

export { fixPrices };