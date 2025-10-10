const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDBStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla products...\n');

    // Obtener algunos productos para ver la estructura real
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error al consultar productos:', error);
      return;
    }

    if (products && products.length > 0) {
      console.log('📋 ESTRUCTURA DE LA TABLA PRODUCTS:');
      console.log('=' .repeat(60));
      
      const product = products[0];
      Object.keys(product).forEach(key => {
        const value = product[key];
        const type = typeof value;
        const sample = type === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        
        console.log(`${key.padEnd(20)} | ${type.padEnd(10)} | ${sample}`);
      });

      console.log('\n✅ Estructura obtenida');
    } else {
      console.log('⚠️ No se encontraron productos en la base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkDBStructure();