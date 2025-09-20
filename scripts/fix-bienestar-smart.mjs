import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ Faltan credenciales Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession:false } });

// Imagen válida por defecto (Unsplash)
const NUEVA_IMG = "https://images.unsplash.com/photo-1599058917212-d750089bc07a?q=80&w=1200&auto=format&fit=crop";

function invalida(v) {
  if (!v || typeof v !== "string") return true;
  return !/^https?:\/\//.test(v);
}

function pickImageKey(row) {
  const candidates = ["imagen","image","image_url","img","foto","picture","media"];
  return candidates.find(k => Object.prototype.hasOwnProperty.call(row, k)) || null;
}

async function main() {
  // Trae TODOS los campos para detectar la key correcta
  let { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("categoria","Bienestar");

  if (error) {
    console.error("❌ No pude leer productos de Bienestar:", error.message);
    process.exit(1);
  }

  if (!data?.length) {
    console.log("ℹ️ No hay productos en 'Bienestar'. Nada que hacer.");
    return;
  }

  const imageKey = pickImageKey(data[0]);
  if (!imageKey) {
    console.error("❌ No encontré ninguna columna de imagen en 'productos' (p.ej. imagen, image, image_url…).");
    console.log("🧾 Campos detectados:", Object.keys(data[0]).join(", "));
    process.exit(1);
  }

  console.log(`🔎 Columna de imagen detectada: ${imageKey}`);
  console.log("🧾 Listado actual (id | nombre | imagen):");
  for (const p of data) {
    console.log("-", p.id, "|", p.nombre, "|", p[imageKey] ?? "(null)");
  }

  // 1) Intenta forzar imagen del producto “Banda elástica…” por id o por nombre
  let objetivoIds = [];

  // Por id clásico
  {
    const { data: d1, error: e1 } = await supabase
      .from("productos")
      .select("id")
      .eq("id","fit-001")
      .maybeSingle();

    if (!e1 && d1?.id) objetivoIds.push(d1.id);
  }

  // Si no existe fit-001, busca por nombre aproximado
  if (objetivoIds.length === 0) {
    const { data: d2, error: e2 } = await supabase
      .from("productos")
      .select("id,nombre")
      .eq("categoria","Bienestar");

    if (!e2 && d2?.length) {
      const target = d2.find(p =>
        String(p.nombre || "").toLowerCase().includes("banda") ||
        String(p.nombre || "").toLowerCase().includes("elast")
      );
      if (target) objetivoIds.push(target.id);
    }
  }

  if (objetivoIds.length) {
    const { error: up1 } = await supabase
      .from("productos")
      .update({ [imageKey]: NUEVA_IMG })
      .in("id", objetivoIds);

    if (up1) console.error("❌ Error actualizando imagen objetivo:", up1.message);
    else console.log("✅ Imagen forzada para:", objetivoIds.join(", "));
  } else {
    console.log("ℹ️ No pude identificar el producto de 'Banda elástica' por id/nombre. Seguimos con el resto…");
  }

  // 2) Corrige cualquier Bienestar con imagen vacía/ inválida
  const faltantes = data.filter(p => invalida(p[imageKey])).map(p => p.id);
  if (faltantes.length) {
    const { error: up2 } = await supabase
      .from("productos")
      .update({ [imageKey]: NUEVA_IMG })
      .in("id", faltantes);
    if (up2) console.error("❌ Error corrigiendo imágenes:", up2.message);
    else console.log("✅ Imágenes corregidas en Bienestar:", faltantes.join(", "));
  } else {
    console.log("ℹ️ No había más imágenes inválidas en Bienestar.");
  }

  // 3) Revisión post-fix
  const { data: check } = await supabase
    .from("productos")
    .select(`id,nombre,${imageKey}`)
    .eq("categoria","Bienestar")
    .order("id");

  console.log("🔁 Post-fix (id | nombre | imagen):");
  for (const p of check || []) {
    console.log("-", p.id, "|", p.nombre, "|", p[imageKey] ?? "(null)");
  }

  console.log("✨ Listo. Haz hard refresh en /categorias/bienestar.");
}

main().catch(e => { console.error(e); process.exit(1); });
