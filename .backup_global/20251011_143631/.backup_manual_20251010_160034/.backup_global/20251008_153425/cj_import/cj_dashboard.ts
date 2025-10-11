import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function dashboard() {
  console.log("🌙 Lunaria — Dashboard CJdropshipping\n");

  // 1. Diagnóstico de entorno
  console.log("🧪 Diagnóstico de entorno:");
  const requiredKeys = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "CJ_ACCESS_TOKEN"];
  for (const key of requiredKeys) {
    if (!process.env[key]) {
      console.error(`❌ Falta clave .env: ${key}`);
    } else {
      console.log(`✅ ${key} presente`);
    }
  }

  // 2. Consultar productos
  const { data: productos, error: prodError } = await supabase
    .from("products")
    .select("id, category_slug, price_cents");

  if (prodError) {
    console.error("❌ Error al consultar 'products':", prodError.message);
    return;
  }

  // 3. Consultar auditoría
  const { data: auditoria, error: auditError } = await supabase
    .from("product_changes")
    .select("id, action, cj_id, timestamp");

  if (auditError) {
    console.error("❌ Error al consultar 'product_changes':", auditError.message);
    return;
  }

  // 4. Consultar errores
  const { data: errores, error: errError } = await supabase
    .from("product_errors")
    .select("id, cj_id, reason, timestamp");

  if (errError) {
    console.error("❌ Error al consultar 'product_errors':", errError.message);
    return;
  }

  // 5. Resumen de productos
  console.log("\n📂 Productos por categoría:");
  if (!productos || productos.length === 0) {
    console.log("⚠️ No hay productos en la tabla.");
  } else {
    const porCategoria: Record<string, { count: number; total: number }> = {};
    for (const p of productos) {
      const cat = p.category_slug || "sin_categoria";
      if (!porCategoria[cat]) porCategoria[cat] = { count: 0, total: 0 };
      porCategoria[cat].count++;
      porCategoria[cat].total += p.price_cents || 0;
    }
    for (const [cat, stats] of Object.entries(porCategoria)) {
      const promedio = stats.total / stats.count / 100;
      console.log(`- ${cat}: ${stats.count} productos (promedio: $${promedio.toFixed(2)})`);
    }
  }

  // 6. Auditoría
  console.log("\n📝 Auditoría de cambios:");
  console.log(`- Total registros: ${auditoria?.length ?? 0}`);
  const inserts = auditoria?.filter(a => a.action === "insert").length ?? 0;
  const updates = auditoria?.filter(a => a.action === "update").length ?? 0;
  console.log(`  • Inserts: ${inserts}`);
  console.log(`  • Updates: ${updates}`);

  // 7. Errores
  console.log("\n⚠️ Errores registrados:");
  console.log(`- Total: ${errores?.length ?? 0}`);
  if (errores && errores.length > 0) {
    console.log("  Ejemplo:", errores[0]);
  }

  console.log("\n✅ Dashboard completado.");
}

dashboard();