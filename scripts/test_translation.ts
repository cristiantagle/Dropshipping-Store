// test_translation.ts
// Script para probar la traducción con algunos ejemplos

import { translateWithOllama, checkOllamaSetup } from '../lib/translation';

async function testTranslation() {
  console.log('🧪 Probando servicio de traducción con Ollama...');
  console.log('');

  // Verificar configuración
  const setup = await checkOllamaSetup();
  
  if (!setup.available || !setup.model) {
    console.error('❌ Configuración incorrecta:', setup.error);
    return;
  }

  console.log('✅ Ollama configurado correctamente');
  console.log('');

  // Textos de prueba (nombres reales de productos de tu BD)
  const testProducts = [
    'Women\'s Loose And Lazy Style Love Sweater Cardigan',
    'Small Night Lamp Glass Ball Small Ornaments Birthday Gift',
    'Vintage Brown Lapel Men\'s Leather Overcoat Jacket',
    'Personality Cloakroom Living Room Porch Light',
    'Fashion Female Metal Chain Bracelet Pearl'
  ];

  console.log('🔄 Traduciendo productos de prueba...');
  console.log('');

  for (let i = 0; i < testProducts.length; i++) {
    const product = testProducts[i];
    console.log(`${i + 1}. Original: "${product}"`);
    
    const result = await translateWithOllama(product, 'en', 'es', 'product_name');
    
    if (result.success) {
      console.log(`   ✅ Traducción: "${result.translation}"`);
    } else {
      console.log(`   ❌ Error: ${result.error}`);
    }
    console.log('');
  }

  console.log('🎯 Prueba completada. ¿Te gustan las traducciones?');
  console.log('');
  console.log('💡 Para traducir todos los productos:');
  console.log('   npx tsx scripts/translate_products.ts');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testTranslation().catch(error => {
    console.error('❌ Error en prueba:', error);
    process.exit(1);
  });
}

export { testTranslation };