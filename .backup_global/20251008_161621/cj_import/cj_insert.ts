// cj_insert.ts
// Inserta productos de CJ en Supabase y registra auditoría en product_changes

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { fetchCJProducts } from "./cj_fetch";
import { validateCJProduct } from "./cj_validate";
import { transformCJProduct } from "./cj_transform";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const dryRun = false;

async function insertarProductos() {
  console.log("📥 Ejecutando importación CJdropshipping...");

  const productos = await fetchCJProducts();

  console.log(`📦 Obtenidos ${productos.length} productos de CJ`);
  if (productos.length > 0) {
    console.log("🔍 Ejemplo:", {
      pid: productos[0].pid,
      name: productos[0].productNameEn,
      productsku: productos[0].productSku,
      price: productos[0].sellPrice,
      category: productos[0].categoryName,
    });
  }

  const transformedAll = productos.map(transformCJProduct);
  const otrosCount = transformedAll.filter(p => p.category_slug === "otros").length;
  if (otrosCount > 0) {
    console.log(`⚠️ ${otrosCount} productos cayeron en 'otros'. Revisa CATEGORY_MAP.`);
  }

  let insertados = 0, actualizados = 0, rechazados = 0;

  for (let i = 0; i < productos.length; i++) {
    const p = productos[i];

    if (!validateCJProduct(p, i)) {
      rechazados++;
      if (!dryRun) {
        await supabase.from("product_errors").insert({
          cj_id: p.pid,
          reason: "Validación fallida",
          raw: p,
        });
      }
      continue;
    }

    const transformed = await transformCJProduct(p);

    if (dryRun) {
      console.log(`🧪 [dryRun] Producto listo: ${transformed.name}`);
      continue;
    }

    // Verificar si ya existe
    const { data: existente } = await supabase
      .from("products")
      .select("id")
      .eq("cj_id", transformed.cj_id)
      .maybeSingle();

    if (existente) {
      // Obtener datos previos para auditoría
      const { data: before } = await supabase
        .from("products")
        .select("*")
        .eq("id", existente.id)
        .maybeSingle();

      const { error } = await supabase
        .from("products")
        .update(transformed)
        .eq("id", existente.id);

      if (error) {
        console.error("❌ Error al actualizar:", error.message);
        rechazados++;
        continue;
      }
      actualizados++;

      // Auditoría: registrar siempre el update
      await supabase.from("product_changes").insert({
        product_id: existente.id,
        cj_id: transformed.cj_id,
        action: "update",
        change_type: "sync",
        old_data: before,
        new_data: transformed,
        timestamp: new Date().toISOString(),
      });

    } else {
      // Insertar nuevo producto
      const { data: inserted, error } = await supabase
        .from("products")
        .insert(transformed)
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("❌ Error al insertar:", error.message);
        rechazados++;
        continue;
      }
      insertados++;

      // Auditoría: registrar siempre el insert
      await supabase.from("product_changes").insert({
        product_id: inserted!.id,
        cj_id: transformed.cj_id,
        action: "insert",
        change_type: "sync",
        old_data: null,
        new_data: transformed,
        timestamp: new Date().toISOString(),
      });
    }
  }

  console.log("\n📊 Resumen de importación:");
  console.log(`- Insertados: ${insertados}`);
  console.log(`- Actualizados: ${actualizados}`);
  console.log(`- Rechazados: ${rechazados}`);
  console.log("✅ Importación completada.");
}

insertarProductos();