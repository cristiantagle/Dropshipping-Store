#!/usr/bin/env node
// Quick diagnostic: verify home categories have products from products_external (AliExpress)
// Uses server-side env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("missing env: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

const categories = [
  "belleza",
  "bienestar",
  "eco",
  "hogar",
  "mascotas",
  "tecnologia",
  "ropa_mujer",
  "ropa_hombre",
];

const limit = parseInt(process.env.CHECK_LIMIT || "6", 10);

async function fetchCategory(slug) {
  const { data, error } = await sb
    .from("products_external")
    .select(
      `product_id, source, title, price, currency,
       products:products!inner ( id, images, category_slug )`
    )
    .eq("source", "aliexpress")
    .eq("products.category_slug", slug)
    .order("price", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row?.products?.id || row.product_id,
    name: row?.title || "",
    image: Array.isArray(row?.products?.images) ? row.products.images[0] : null,
    price: row?.price ?? null,
    category_slug: slug,
  }));
}

(async () => {
  console.log("Checking home categories (limit=%d)...", limit);
  const results = [];
  for (const slug of categories) {
    try {
      const items = await fetchCategory(slug);
      results.push({ slug, count: items.length, sample: items.slice(0, 3) });
    } catch (e) {
      results.push({ slug, error: e?.message || String(e) });
    }
  }
  // Print concise summary first
  for (const r of results) {
    if (r.error) {
      console.log(`- ${r.slug}: ERROR ${r.error}`);
    } else {
      console.log(`- ${r.slug}: ${r.count} item(s)`);
    }
  }
  // Then include small sample for non-empty categories
  for (const r of results) {
    if (r.error || !r.count) continue;
    console.log(`\n${r.slug} — sample:`);
    for (const it of r.sample) {
      console.log(`  • ${it.id} | ${it.name?.slice(0, 80) || "(sin título)"} | $${it.price}`);
    }
  }
})();
