import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Faltan credenciales Supabase"); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession:false }});

const { data, error } = await supabase
  .from("productos")
  .select("id,nombre,imagen,categoria")
  .eq("categoria","Bienestar")
  .order("id");

if (error) { console.error("❌ Inspect error:", error.message); process.exit(1); }
if (!data?.length) { console.log("ℹ️ No hay productos de Bienestar."); process.exit(0); }

console.log("🧾 Bienestar (id, nombre, imagen):");
for (const p of data) {
  console.log("-", p.id, "|", p.nombre, "|", p.imagen ?? "(null)");
}
