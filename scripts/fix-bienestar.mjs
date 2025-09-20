import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession:false } });

const NUEVA_IMG = "https://images.unsplash.com/photo-1599058917212-d750089bc07a?q=80&w=1200&auto=format&fit=crop";
const isHttp = (s) => typeof s === "string" && /^https?:\/\//.test(s);
const toLower = (s) => String(s ?? "").toLowerCase();

console.log("🔎 Leyendo Bienestar antes…");
let { data: prev, error: ePrev } = await supabase
  .from("productos")
  .select("id,nombre,imagen_url,categoria_slug")
  .eq("categoria_slug","bienestar")
  .limit(200);
if (ePrev) {
  console.error("❌ read error:", ePrev.message);
  process.exit(1);
}
for (const p of (prev ?? [])) {
  console.log(`- ${p.id} | ${p.nombre} | img:${isHttp(p.imagen_url)?"OK":"X"} | ${p.imagen_url ?? "(null)"}`);
}

const objetivos = new Set();
// intenta forzar banda elástica
for (const p of (prev ?? [])) {
  const n = toLower(p.nombre);
  if (n.includes("banda") || n.includes("elast")) {
    objetivos.add(p.id);
  }
}
// agrega todos los que no tienen imagen válida
for (const p of (prev ?? [])) {
  if (!isHttp(p.imagen_url)) objetivos.add(p.id);
}

if (objetivos.size) {
  const ids = [...objetivos];
  const { error: up } = await supabase
    .from("productos")
    .update({ imagen_url: NUEVA_IMG })
    .in("id", ids);
  if (up) {
    console.error("❌ update error:", up.message);
    process.exit(1);
  }
  console.log("✅ Imágenes actualizadas para:", ids.join(", "));
} else {
  console.log("ℹ️ No había nada que actualizar en Bienestar.");
}

console.log("🔁 Leyendo Bienestar después…");
let { data: post } = await supabase
  .from("productos")
  .select("id,nombre,imagen_url,categoria_slug")
  .eq("categoria_slug","bienestar")
  .limit(200);
for (const p of (post ?? [])) {
  console.log(`- ${p.id} | ${p.nombre} | img:${isHttp(p.imagen_url)?"OK":"X"} | ${p.imagen_url ?? "(null)"}`);
}

console.log("✨ Listo. Haz hard refresh en /categorias/bienestar");
