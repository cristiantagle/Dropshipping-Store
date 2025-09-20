import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession:false } });

const toLower = (s) => String(s ?? "").toLowerCase();
const isHttp = (s) => typeof s === "string" && /^https?:\/\//.test(s);

const { data, error } = await supabase
  .from("productos")
  .select("id,nombre,categoria_slug,imagen_url,precio,envio,destacado")
  .order("categoria_slug", { ascending:true })
  .order("id", { ascending:true });

if (error) {
  console.error("❌ dump error:", error.message);
  process.exit(1);
}

const groups = new Map();
for (const p of (data ?? [])) {
  const k = toLower(p.categoria_slug);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(p);
}

for (const [cat, arr] of groups) {
  console.log(`\n=== ${cat} (${arr.length}) ===`);
  for (const p of arr) {
    const ok = isHttp(p.imagen_url) ? "OK" : "X";
    console.log(`- ${p.id} | ${p.nombre} | img:${ok} | $${p.precio} | ${p.imagen_url ?? "(null)"}`);
  }
}
