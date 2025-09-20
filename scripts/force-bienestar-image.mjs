import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Faltan credenciales Supabase"); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession:false }});

// Nueva imagen (Unsplash, válida)
const NUEVA_IMG = "https://images.unsplash.com/photo-1599058917212-d750089bc07a?q=80&w=1200&auto=format&fit=crop";

function invalida(img){
  if (!img) return true;
  if (typeof img !== "string") return true;
  if (!/^https?:\/\//.test(img)) return true;
  return false;
}

// 2.a) Forzar fit-001
{
  const { data, error } = await supabase
    .from("productos")
    .select("id")
    .eq("id","fit-001")
    .maybeSingle();

  if (error) { console.error("❌ Lookup fit-001:", error.message); process.exit(1); }
  if (!data) {
    console.log("ℹ️ fit-001 no existe, nada que forzar.");
  } else {
    const { error: upErr } = await supabase
      .from("productos")
      .update({ imagen: NUEVA_IMG })
      .eq("id","fit-001");
    if (upErr) console.error("❌ Update fit-001:", upErr.message);
    else console.log("✅ Imagen forzada para fit-001 (Banda elástica).");
  }
}

// 2.b) Cualquier Bienestar con imagen inválida
{
  const { data, error } = await supabase
    .from("productos")
    .select("id,imagen")
    .eq("categoria","Bienestar");

  if (error) { console.error("❌ Fetch Bienestar:", error.message); process.exit(1); }

  const ids = (data||[])
    .filter(p => invalida(p.imagen))
    .map(p => p.id);

  if (!ids.length) {
    console.log("ℹ️ No hay más productos de Bienestar con imagen inválida.");
  } else {
    const { error: upErr } = await supabase
      .from("productos")
      .update({ imagen: NUEVA_IMG })
      .in("id", ids);
    if (upErr) console.error("❌ Update Bienestar:", upErr.message);
    else console.log("✅ Imágenes corregidas en Bienestar:", ids.join(", "));
  }
}
