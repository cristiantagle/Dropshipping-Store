// scripts/fix-bienestar-images.mjs
import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

// Imagen nueva para la banda elástica (Unsplash, alta resolución)
const NUEVA_IMG = "https://images.unsplash.com/photo-1599058917212-d750089bc07a?q=80&w=1200&auto=format&fit=crop";

function isBad(img) {
  if (!img) return true;
  if (typeof img !== "string") return true;
  if (!/^https?:\/\//.test(img)) return true;
  return false;
}

async function run() {
  const { data: prod } = await supabase
    .from("productos")
    .select("id, imagen, nombre, categoria")
    .eq("id", "fit-001")
    .maybeSingle();

  if (prod && isBad(prod.imagen)) {
    const { error } = await supabase
      .from("productos")
      .update({ imagen: NUEVA_IMG })
      .eq("id", "fit-001");

    if (error) {
      console.error("❌ No se pudo actualizar la imagen de fit-001:", error.message);
    } else {
      console.log("✅ Imagen actualizada para fit-001 (Banda elástica).");
    }
  } else {
    console.log("ℹ️ fit-001 ya tiene imagen válida o no existe.");
  }

  const { data: lista } = await supabase
    .from("productos")
    .select("id, imagen, categoria")
    .eq("categoria", "Bienestar");

  const aCorregir = (lista || []).filter(p => isBad(p.imagen)).map(p => p.id);
  if (aCorregir.length) {
    const { error } = await supabase
      .from("productos")
      .update({ imagen: NUEVA_IMG })
      .in("id", aCorregir);

    if (error) {
      console.error("❌ No se pudieron actualizar imágenes en Bienestar:", error.message);
    } else {
      console.log(`✅ Imágenes corregidas en Bienestar: ${aCorregir.join(", ")}`);
    }
  } else {
    console.log("ℹ️ No hay más productos de Bienestar con imagen inválida.");
  }
}

run().catch(err => {
  console.error("Fallo inesperado:", err);
  process.exit(1);
});
