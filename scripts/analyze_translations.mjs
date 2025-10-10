import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📊 ANÁLISIS DE TRADUCCIONES\n');

if (!url || !key) {
  console.error('❌ Faltan variables de entorno.');
  process.exit(1);
}

const supabase = createClient(url, key);

try {
  // Obtener todos los productos
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, name_es, description_es, short_desc_es, long_desc_es, category_slug')
    .order('category_slug');

  if (error) throw error;

  // Analizar por categoría
  const stats = {};
  
  products.forEach(product => {
    const cat = product.category_slug || 'sin_categoria';
    
    if (!stats[cat]) {
      stats[cat] = {
        total: 0,
        name_es: 0,
        description_es: 0,
        short_desc_es: 0,
        long_desc_es: 0,
        completamente_traducido: 0
      };
    }
    
    stats[cat].total++;
    
    // Verificar qué campos están traducidos
    if (product.name_es && product.name_es.trim()) stats[cat].name_es++;
    if (product.description_es && product.description_es.trim()) stats[cat].description_es++;
    if (product.short_desc_es && product.short_desc_es.trim()) stats[cat].short_desc_es++;
    if (product.long_desc_es && product.long_desc_es.trim()) stats[cat].long_desc_es++;
    
    // Producto completamente traducido
    if (product.name_es && product.description_es && product.short_desc_es && product.long_desc_es) {
      stats[cat].completamente_traducido++;
    }
  });

  // Mostrar resultados
  console.log('📈 ESTADÍSTICAS POR CATEGORÍA:\n');
  
  Object.entries(stats)
    .sort((a, b) => b[1].total - a[1].total) // Ordenar por cantidad total
    .forEach(([category, data]) => {
      const completado = ((data.completamente_traducido / data.total) * 100).toFixed(1);
      
      console.log(`🏷️  ${category.toUpperCase()}`);
      console.log(`   Total productos: ${data.total}`);
      console.log(`   Completamente traducidos: ${data.completamente_traducido} (${completado}%)`);
      console.log(`   📝 name_es: ${data.name_es}/${data.total}`);
      console.log(`   📄 description_es: ${data.description_es}/${data.total}`);
      console.log(`   📄 short_desc_es: ${data.short_desc_es}/${data.total}`);
      console.log(`   📄 long_desc_es: ${data.long_desc_es}/${data.total}`);
      console.log('');
    });

  // Resumen total
  const totalProducts = products.length;
  const totalCompleto = Object.values(stats).reduce((sum, cat) => sum + cat.completamente_traducido, 0);
  const porcentajeTotal = ((totalCompleto / totalProducts) * 100).toFixed(1);
  
  console.log('🎯 RESUMEN TOTAL:');
  console.log(`   Total productos: ${totalProducts}`);
  console.log(`   Completamente traducidos: ${totalCompleto} (${porcentajeTotal}%)`);
  console.log(`   Pendientes: ${totalProducts - totalCompleto}`);

} catch (e) {
  console.error('❌ Error:', e?.message ?? e);
  process.exit(1);
}