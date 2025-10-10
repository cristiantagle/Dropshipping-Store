// cj_insert.ts
import { fetchCJProducts } from "./cj_fetch";
import { transformCJProduct } from "./cj_transform";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function insertarProductos(limit = 100, omitExisting = true, categoryId?: string) {
  // Trae desde CJ con filtro de categoría opcional
  const productos = await fetchCJProducts(limit, categoryId);

  // Validaciones defensivas
  if (!Array.isArray(productos)) {
    console.error("❌ fetchCJProducts no devolvió un array válido:", productos);
    return;
  }

  console.log(`📦 Obtenidos ${productos.length} productos de CJ`);

  if (productos.length === 0) {
    console.warn("⚠️ No se recibieron productos de CJ. Revisa tu token o endpoint.");
    return;
  }

  // Transforma a filas para Supabase
  const transformedAll = productos.map(transformCJProduct);

  // Si corresponde, filtra existentes por cj_id
  let toInsert = transformedAll;
  if (omitExisting) {
    const ids = transformedAll.map(p => p.cj_id);
    const { data: existentes, error: errExist } = await supabase
      .from("products")
      .select("cj_id")
      .in("cj_id", ids);

    if (errExist) {
      console.error("❌ Error consultando existentes en products:", errExist.message);
      return;
    }

    const setExistentes = new Set((existentes ?? []).map(r => r.cj_id));
    toInsert = transformedAll.filter(p => !setExistentes.has(p.cj_id));
    console.log(`🧹 Omitiendo existentes: ${setExistentes.size}. A insertar: ${toInsert.length}.`);
  }

  if (toInsert.length === 0) {
    console.log("✅ No hay nuevos productos para insertar en products.");
    return;
  }

  // 🔎 Debug: mostrar slugs únicos antes de insertar
  const uniqueSlugs = [...new Set(toInsert.map(p => p.category_slug))];
  console.log("🔎 Slugs generados para insertar:", uniqueSlugs);
// Debug avanzado: detectar slugs inválidos
toInsert.forEach((p, i) => {
  if (!p.category_slug || p.category_slug.trim() === "") {
    console.warn(`⚠️ Producto sin slug válido en índice ${i}, cj_id=${p.cj_id}`);
  } else if (![
    "hogar","belleza","bienestar","eco","mascotas",
    "tecnologia","ropa_hombre","ropa_mujer","accesorios","otros"
  ].includes(p.category_slug.trim())) {
    console.warn(`⚠️ Slug inválido detectado: "${p.category_slug}" en cj_id=${p.cj_id}`);
  }
});
  // Inserta en la tabla correcta: products
  const { error: insertErr } = await supabase
    .from("products")
    .insert(toInsert);

  if (insertErr) {
    console.error("❌ Error insertando en products:", insertErr.message);
    return;
  }

  console.log(`✅ Insertados ${toInsert.length} productos en products.`);
}

// Permite ejecutar directo: ts-node cj_insert.ts
// Comentado para evitar error de compilación en Next.js build
/*
if (import.meta.main) {
  const limitArg = Number(process.argv[2] ?? 100);
  insertarProductos(limitArg, true).catch((e) =>
    console.error("❌ Falló la inserción:", e)
  );
}
*/
