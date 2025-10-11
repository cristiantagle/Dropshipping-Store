// cj_import_category.ts
// Script para importar productos de categorías específicas de CJDropshipping
import { insertarProductos } from "./cj_insert";

// Mapeo de categorías CJ (IDs comunes conocidos)
const CJ_CATEGORIES = {
  // Tecnología y Electrónicos
  electronics: "100007",
  phones: "100099",
  computers: "100003",
  gadgets: "100012",
  
  // Belleza y Cuidado Personal
  beauty: "100014",
  skincare: "100090",
  makeup: "100091",
  health: "100015",
  
  // Hogar y Jardín
  home: "100001",
  kitchen: "100025",
  furniture: "100026",
  garden: "100028",
  
  // Deportes y Fitness
  sports: "100009",
  fitness: "100087",
  outdoor: "100088",
  
  // Mascotas
  pets: "100017",
  
  // Moda (genérico)
  fashion: "100002",
  bags: "100054",
  jewelry: "100055",
  watches: "100056"
};

// Función principal
async function importByCategory() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('🎯 IMPORTADOR DE CATEGORÍAS ESPECÍFICAS CJ\n');
    console.log('Uso: ts-node -P tsconfig.json cj_import_category.ts <categoria> [limite]\n');
    console.log('Categorías disponibles:');
    Object.entries(CJ_CATEGORIES).forEach(([name, id]) => {
      console.log(`  ${name} (ID: ${id})`);
    });
    console.log('\nEjemplos:');
    console.log('  ts-node -P tsconfig.json cj_import_category.ts electronics 50');
    console.log('  ts-node -P tsconfig.json cj_import_category.ts beauty 30');
    console.log('  ts-node -P tsconfig.json cj_import_category.ts pets 20');
    return;
  }

  const categoryName = args[0];
  const limit = parseInt(args[1] || '50');
  
  const categoryId = CJ_CATEGORIES[categoryName as keyof typeof CJ_CATEGORIES];
  
  if (!categoryId) {
    console.error(`❌ Categoría "${categoryName}" no encontrada.`);
    console.log('Categorías disponibles:', Object.keys(CJ_CATEGORIES).join(', '));
    return;
  }

  console.log(`🎯 Importando ${limit} productos de categoría: ${categoryName} (ID: ${categoryId})\n`);
  
  try {
    await insertarProductos(limit, true, categoryId);
    console.log('\n✅ Importación completada!');
    console.log('💡 Recomendación: Ejecuta analyze_translations.mjs para ver la nueva distribución');
  } catch (error) {
    console.error('❌ Error en importación:', error);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  importByCategory().catch(console.error);
}