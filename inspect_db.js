const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  // Ver tablas
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('📋 TABLAS DISPONIBLES:');
    rows.forEach(row => console.log('  -', row.name));
    
    // Ver estructura de Product
    db.all("PRAGMA table_info(Product)", (err, columns) => {
      if (err) {
        console.error('Error con tabla Product:', err);
        return;
      }
      
      console.log('\n📋 ESTRUCTURA DE LA TABLA Product:');
      columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
      });
      
      // Ver algunos productos con imágenes
      db.all("SELECT id, name, images FROM Product WHERE name IS NOT NULL LIMIT 5", (err, products) => {
        if (err) {
          console.error('Error consultando productos:', err);
          return;
        }
        
        console.log('\n🔍 MUESTRA DE PRODUCTOS Y SUS IMÁGENES:');
        let totalImages = 0;
        products.forEach(product => {
          try {
            const images = JSON.parse(product.images || '[]');
            totalImages += images.length;
            console.log(`\nID: ${product.id.substring(0, 8)}...`);
            console.log(`Nombre: ${product.name.substring(0, 50)}...`);
            console.log(`Número de imágenes: ${images.length}`);
            if (images.length > 0) {
              console.log(`Primera imagen: ${images[0].substring(0, 80)}...`);
            }
          } catch (e) {
            console.log(`Error procesando imágenes del producto ${product.id}: ${e.message}`);
          }
        });
        
        console.log(`\n📊 RESUMEN:`);
        console.log(`Productos analizados: ${products.length}`);
        console.log(`Total de imágenes: ${totalImages}`);
        console.log(`Promedio por producto: ${(totalImages / products.length).toFixed(1)}`);
        
        db.close();
      });
    });
  });
});