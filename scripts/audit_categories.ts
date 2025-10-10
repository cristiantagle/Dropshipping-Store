import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { mapCategory, CATEGORY_MAP } from "../cj_import/cj_config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditCategories() {
  console.log("📊 Auditando categorías de productos...");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, original_category")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("❌ Error al consultar productos:", error.message);
    return;
  }

  let mapped = 0;
  let guessed = 0;
  let otros = 0;

  const mapKeys = Object.keys(CATEGORY_MAP).map(k => k.toLowerCase());

  for (const p of products!) {
    const cjCategory = p.original_category || "";
    const final = mapCategory(cjCategory);
    const normalized = cjCategory.trim().toLowerCase();

    const method = final === "otros"
      ? "❌ otros"
      : mapKeys.includes(normalized)
        ? "✅ directo"
        : "🤖 IA";

    if (method === "✅ directo") mapped++;
    else if (method === "🤖 IA") guessed++;
    else otros++;

    console.log(`• ${p.name.slice(0, 40)}... → CJ: "${cjCategory}" → Final: "${final}" → ${method}`);
  }

  console.log("\n📋 Resumen:");
  console.log(`✅ Mapeadas directo: ${mapped}`);
  console.log(`🤖 Clasificadas por IA: ${guessed}`);
  console.log(`❌ Quedaron en 'otros': ${otros}`);
}

auditCategories();
