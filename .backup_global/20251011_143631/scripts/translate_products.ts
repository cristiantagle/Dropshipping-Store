// translate_products.ts
// Script para traducir nombres de productos usando Ollama

import { createClient } from '@supabase/supabase-js';
import { translateBatch, checkOllamaSetup, translateWithOllama } from '../lib/translation';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Product {
  id: string;
  name: string;
  name_es?: string;
}

async function translateProducts() {
  console.log('🚀 Iniciando traducción masiva de productos...');
  console.log('');

  // 1. Verificar configuración de Ollama
  console.log('🔍 Verificando configuración de Ollama...');
  const setup = await checkOllamaSetup();
  
  if (!setup.available || !setup.model) {
    console.error('❌ Error de configuración:', setup.error);
    console.log('');
    console.log('📋 Para configurar Ollama:');
    console.log('1. Instala Ollama desde: https://ollama.ai');
    console.log('2. Ejecuta: ollama pull qwen2.5:7b');
    console.log('3. O ejecuta: .\\scripts\\setup_translation_model.ps1');
    return;
  }
  
  console.log('✅ Ollama configurado correctamente');
  console.log('');

  // 2. Obtener productos sin traducir o con traducción vacía
  console.log('📦 Obteniendo productos desde la base de datos...');
  
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name, name_es')
    .or('name_es.is.null,name_es.eq.""');

  if (fetchError) {
    console.error('❌ Error obteniendo productos:', fetchError);
    return;
  }

  if (!products || products.length === 0) {
    console.log('✅ ¡Todos los productos ya están traducidos!');
    return;
  }

  console.log(`📊 Se encontraron ${products.length} productos para traducir`);
  console.log('');

  // 3. Mostrar algunos ejemplos
  console.log('📋 Ejemplos de productos a traducir:');
  products.slice(0, 5).forEach((product, index) => {
    console.log(`  ${index + 1}. "${product.name}"`);
  });
  console.log('');

  // 4. Confirmar antes de proceder
  console.log('⏳ La traducción puede tomar varios minutos...');
  console.log('🔄 Iniciando proceso en 3 segundos...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 5. Traducir nombres de productos
  const productNames = products.map(p => p.name);
  const translations = await translateBatch(
    productNames,
    'en',
    'es',
    'product_name'
  );

  // 6. Procesar resultados
  const updates: Array<{id: string, name_es: string}> = [];
  const errors: Array<{id: string, name: string, error: string}> = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const result = translations[i];

    if (result.success && result.translation) {
      updates.push({
        id: product.id,
        name_es: result.translation
      });
    } else {
      errors.push({
        id: product.id,
        name: product.name,
        error: result.error || 'Error desconocido'
      });
    }
  }

  console.log('');
  console.log('📊 Resumen de traducción:');
  console.log(`✅ Exitosas: ${updates.length}`);
  console.log(`❌ Errores: ${errors.length}`);

  // 7. Actualizar base de datos
  if (updates.length > 0) {
    console.log('');
    console.log('💾 Actualizando base de datos...');

    let updated = 0;
    const batchSize = 50;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      for (const update of batch) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ name_es: update.name_es })
          .eq('id', update.id);

        if (updateError) {
          console.error(`❌ Error actualizando ${update.id}:`, updateError);
        } else {
          updated++;
        }
      }

      console.log(`📝 Actualizados ${updated}/${updates.length} productos`);
    }

    console.log(`✅ ¡${updated} productos actualizados exitosamente!`);
  }

  // 8. Mostrar errores si los hay
  if (errors.length > 0) {
    console.log('');
    console.log('⚠️ Productos con errores de traducción:');
    errors.slice(0, 10).forEach((error, index) => {
      console.log(`  ${index + 1}. "${error.name}" - ${error.error}`);
    });
    
    if (errors.length > 10) {
      console.log(`  ... y ${errors.length - 10} errores más`);
    }
    
    console.log('');
    console.log('💡 Tip: Puedes ejecutar el script nuevamente para reintentar los errores');
  }

  console.log('');
  console.log('🎉 ¡Proceso de traducción completado!');
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  translateProducts().then(() => process.exit(0)).catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

export { translateProducts };