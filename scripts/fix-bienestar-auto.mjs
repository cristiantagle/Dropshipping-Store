import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ Faltan credenciales Supabase (.env.local): NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession:false } });

// Candidatos de tabla y columnas
const TABLE_CANDIDATES = ["productos","products","items","catalogo","catalog","product"];
const IMG_CANDIDATES = ["imagen","image","image_url","img","foto","picture","media"];
const CAT_CANDIDATES = ["categoria","category","cat","categoria_slug","slug_categoria"];

const NUEVA_IMG = "https://images.unsplash.com/photo-1599058917212-d750089bc07a?q=80&w=1200&auto=format&fit=crop";

const invalida = (v) => !v || typeof v !== "string" || !/^https?:\/\//.test(v);

async function probeTable(name) {
  const { data, error } = await supabase.from(name).select("*").limit(1);
  if (error) return null;
  return { name, sample: (data && data[0]) ? data[0] : null };
}

function pickKey(row, candidates) {
  if (!row) return null;
  return candidates.find(k => Object.prototype.hasOwnProperty.call(row, k)) || null;
}

async function main() {
  // 1) Detecta tabla existente
  let tableInfo = null;
  for (const t of TABLE_CANDIDATES) {
    const probed = await probeTable(t);
    if (probed) { tableInfo = probed; break; }
  }
  if (!tableInfo) {
    console.error("❌ No pude detectar una tabla de productos. Probé:", TABLE_CANDIDATES.join(", "));
    process.exit(1);
  }
  const TABLE = tableInfo.name;
  console.log("🧭 Tabla detectada:", TABLE);

  // 2) Trae un registro (o más) para detectar columnas
  let { data: some, error: eSome } = await supabase.from(TABLE).select("*").limit(5);
  if (eSome) {
    console.error(`❌ No pude leer datos de ${TABLE}:`, eSome.message);
    process.exit(1);
  }
  const sample = (some && some[0]) ? some[0] : {};
  const imageKey = pickKey(sample, IMG_CANDIDATES);
  const catKey   = pickKey(sample, CAT_CANDIDATES);

  if (!imageKey) {
    console.error("❌ No encontré columna de imagen. Candidatos:", IMG_CANDIDATES.join(", "));
    console.log("🧾 Campos detectados:", Object.keys(sample || {}).join(", "));
    process.exit(1);
  }
  if (!catKey) {
    console.error("❌ No encontré columna de categoría. Candidatos:", CAT_CANDIDATES.join(", "));
    console.log("🧾 Campos detectados:", Object.keys(sample || {}).join(", "));
    process.exit(1);
  }

  console.log(`🔑 Columna imagen: ${imageKey} | Columna categoría: ${catKey}`);

  // 3) Listado previo de Bienestar (sin asumir nombre exacto de categoría)
  let { data: prevAll, error: ePrev } = await supabase.from(TABLE).select(`id,nombre,${catKey},${imageKey}`).limit(200);
  if (ePrev) {
    console.error("❌ No pude listar productos:", ePrev.message);
    process.exit(1);
  }
  const toLower = (s) => String(s || "").toLowerCase();
  const isBienestar = (row) => toLower(row[catKey]).includes("bienestar");
  const prevBienestar = (prevAll || []).filter(isBienestar);

  console.log("🧾 Antes (Bienestar):");
  if (!prevBienestar.length) {
    console.log("  (sin filas Bienestar detectadas por coincidencia en texto)");
  } else {
    for (const p of prevBienestar) {
      console.log("-", p.id, "|", p.nombre, "|", p[catKey], "|", p[imageKey] ?? "(null)");
    }
  }

  // 4) Intenta encontrar el producto “Banda elástica …” por id = fit-001 o por nombre
  let objetivoIds = [];

  {
    const { data: d1, error: e1 } = await supabase.from(TABLE).select("id").eq("id","fit-001").maybeSingle();
    if (!e1 && d1?.id) objetivoIds.push(d1.id);
  }

  if (objetivoIds.length === 0) {
    const { data: d2 } = await supabase.from(TABLE).select("id,nombre").limit(500);
    const target = (d2 || []).find(p => {
      const n = toLower(p.nombre);
      return n.includes("banda") || n.includes("elast");
    });
    if (target) objetivoIds.push(target.id);
  }

  if (objetivoIds.length) {
    const { error: up1 } = await supabase.from(TABLE).update({ [imageKey]: NUEVA_IMG }).in("id", objetivoIds);
    if (up1) console.error("❌ Error actualizando imagen objetivo:", up1.message);
    else console.log("✅ Imagen forzada para:", objetivoIds.join(", "));
  } else {
    console.log("ℹ️ No pude identificar el producto 'Banda elástica…'. Continuamos con el resto de Bienestar.");
  }

  // 5) Corrige todos los Bienestar con imagen inválida
  const faltantes = (prevBienestar || []).filter(p => invalida(p[imageKey])).map(p => p.id);
  if (faltantes.length) {
    const { error: up2 } = await supabase.from(TABLE).update({ [imageKey]: NUEVA_IMG }).in("id", faltantes);
    if (up2) console.error("❌ Error corrigiendo imágenes:", up2.message);
    else console.log("✅ Imágenes corregidas en Bienestar:", faltantes.join(", "));
  } else {
    console.log("ℹ️ No había imágenes inválidas en Bienestar.");
  }

  // 6) Post-fix
  let { data: postAll } = await supabase.from(TABLE).select(`id,nombre,${catKey},${imageKey}`).limit(200);
  const postBienestar = (postAll || []).filter(isBienestar);
  console.log("🔁 Después (Bienestar):");
  if (!postBienestar.length) {
    console.log("  (sin filas Bienestar detectadas por coincidencia en texto)");
  } else {
    for (const p of postBienestar) {
      console.log("-", p.id, "|", p.nombre, "|", p[catKey], "|", p[imageKey] ?? "(null)");
    }
  }

  console.log("✨ Listo. Haz hard refresh en /categorias/bienestar.");
}

main().catch(e => { console.error(e); process.exit(1); });
