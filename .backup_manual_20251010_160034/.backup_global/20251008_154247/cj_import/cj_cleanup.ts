import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function limpiar() {
  console.log("🧹 Iniciando limpieza de datos CJdropshipping...");

  // Borrar todos los productos
  const { error: prodError } = await supabase
    .from("products")
    .delete()
    .not("id", "is", null);

  if (prodError) {
    console.error("❌ Error al borrar products:", prodError.message);
  } else {
    console.log("✅ products limpiado correctamente");
  }

  // Borrar auditoría
  const { error: auditError } = await supabase
    .from("product_changes")
    .delete()
    .not("id", "is", null);

  if (auditError) {
    console.error("❌ Error al borrar product_changes:", auditError.message);
  } else {
    console.log("✅ product_changes limpiado correctamente");
  }

  // Borrar errores
  const { error: errError } = await supabase
    .from("product_errors")
    .delete()
    .not("id", "is", null);

  if (errError) {
    console.error("❌ Error al borrar product_errors:", errError.message);
  } else {
    console.log("✅ product_errors limpiado correctamente");
  }

  console.log("🎉 Limpieza finalizada.");
}

limpiar();