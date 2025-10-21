#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { URL as NodeURL } from "url";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("missing env");
  process.exit(1);
}
const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

(async () => {
  const { data, error } = await sb
    .from("products_external")
    .select("products:products(images)")
    .limit(200);
  if (error) throw error;
  const hosts = new Set();
  for (const row of data || []) {
    const imgs = Array.isArray(row?.products?.images) ? row.products.images : [];
    if (!imgs.length) continue;
    for (const img of imgs.slice(0, 3)) {
      try { hosts.add(new NodeURL(img).hostname); } catch {}
    }
  }
  console.log(Array.from(hosts).sort().join("\n"));
})();

