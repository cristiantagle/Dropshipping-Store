import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generarReporte() {
  console.log("📊 Generando reporte de importación...");

  // 1. Consultar productos
  const { data: productos, error: prodError } = await supabase
    .from("products")
    .select("id, category_slug, price_cents");

  if (prodError) {
    console.error("❌ Error al consultar tabla 'products':", prodError.message);
    return;
  }

  // 2. Consultar auditoría
  const { data: auditoria, error: auditError } = await supabase
    .from("product_changes")
    .select("id, action, cj_id, timestamp");

  if (auditError) {
    console.error("❌ Error al consultar tabla 'product_changes':", auditError.message);
    return;
  }

  // 3. Consultar errores
  const { data: errores, error: errError } = await supabase
    .from("product_errors")
    .select("id, cj_id, reason, timestamp");

  if (errError) {
    console.error("❌ Error al consultar tabla 'product_errors':", errError.message);
    return;
  }

  // 4. Procesar productos
  if (!productos || productos.length === 0) {
    console.log("⚠️ No hay productos en la tabla.");
    return;
  }

  const porCategoria: Record<string, { count: number; total: number }> = {};

  for (const p of productos) {
    const cat = p.category_slug || "sin_categoria";
    if (!porCategoria[cat]) {
      porCategoria[cat] = { count: 0, total: 0 };
    }
    porCategoria[cat].count++;
    porCategoria[cat].total += p.price_cents || 0;
  }

  console.log("\n📂 Productos por categoría:");
  for (const [cat, stats] of Object.entries(porCategoria)) {
    const promedio = stats.total / stats.count / 100; // convertir a USD
    console.log(`- ${cat}: ${stats.count} productos (precio promedio: $${promedio.toFixed(2)})`);
  }

  // 5. Auditoría
  console.log("\n📝 Auditoría de cambios:");
  console.log(`- Total registros: ${auditoria?.length ?? 0}`);
  const inserts = auditoria?.filter(a => a.action === "insert").length ?? 0;
  const updates = auditoria?.filter(a => a.action === "update").length ?? 0;
  console.log(`  • Inserts: ${inserts}`);
  console.log(`  • Updates: ${updates}`);

  // 6. Errores
  console.log("\n⚠️ Errores registrados:");
  console.log(`- Total: ${errores?.length ?? 0}`);
  if (errores && errores.length > 0) {
    console.log("  Ejemplo:", errores[0]);
  }

  console.log("\n✅ Reporte completado.");
}

generarReporte();