#!/usr/bin/env node
// Diagnose broken images for home/products listings
// - Fetches products_external joined with products.images
// - Checks presence and URL validity of first image
// - Performs HEAD/GET request to verify reachability

import { createClient } from "@supabase/supabase-js";
import https from "https";
import http from "http";
import { URL as NodeURL } from "url";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("missing env: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

const limit = parseInt(process.env.DIAG_LIMIT || "50", 10);
const source = process.env.DIAG_SOURCE || "aliexpress";

function allowedHost(hostname) {
  // Mirror next.config.js remotePatterns (simplified check)
  const patterns = [
    /(^|\.)supabase\.co$/,
    /^images\.unsplash\.com$/,
    /(^|\.)alicdn\.com$/,
    /^img\.alicdn\.com$/,
    /^g\.alicdn\.com$/,
    /^ae01\.alicdn\.com$/,
    /^aeproductimages\.s3\.amazonaws\.com$/,
    /(^|\.)aliexpress-media\.com$/,
  ];
  return patterns.some((re) => re.test(hostname));
}

async function headOrGet(u) {
  try {
    const target = new NodeURL(u);
    const isHttps = target.protocol === "https:";
    const lib = isHttps ? https : http;
    const method = "HEAD";
    const res = await new Promise((resolve, reject) => {
      const req = lib.request(
        {
          method,
          hostname: target.hostname,
          path: target.pathname + target.search,
          headers: { "User-Agent": "diag-images/1.0" },
        },
        (resp) => resolve(resp)
      );
      req.on("error", reject);
      req.end();
    });
    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
      return { ok: true, status: res.statusCode };
    }
    // Fallback to GET if HEAD not allowed
    const res2 = await new Promise((resolve, reject) => {
      const req = lib.request(
        {
          method: "GET",
          hostname: target.hostname,
          path: target.pathname + target.search,
          headers: { "User-Agent": "diag-images/1.0" },
        },
        (resp) => resolve(resp)
      );
      req.on("error", reject);
      req.end();
    });
    return { ok: (res2.statusCode || 0) >= 200 && (res2.statusCode || 0) < 400, status: res2.statusCode };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}

(async () => {
  const { data, error } = await sb
    .from("products_external")
    .select("product_id, source, title, products:products(id, images, category_slug)")
    .eq("source", source)
    .limit(limit);
  if (error) throw error;

  let missing = 0;
  let invalid = 0;
  let disallowed = 0;
  let unreachable = 0;
  let ok = 0;

  const rows = data || [];
  console.log(`Inspecting ${rows.length} records (source=${source})...`);
  for (const row of rows) {
    const img = Array.isArray(row?.products?.images) ? row.products.images[0] : null;
    const id = row?.products?.id || row.product_id;
    if (!img) {
      missing++;
      console.log(`- ${id}: MISSING image`);
      continue;
    }
    let parsed;
    try {
      parsed = new NodeURL(img);
    } catch {
      invalid++;
      console.log(`- ${id}: INVALID URL -> ${img}`);
      continue;
    }
    if (!/^https?:$/.test(parsed.protocol)) {
      invalid++;
      console.log(`- ${id}: INVALID PROTOCOL ${parsed.protocol} -> ${img}`);
      continue;
    }
    const allowed = allowedHost(parsed.hostname);
    if (!allowed) {
      disallowed++;
      console.log(`- ${id}: DISALLOWED HOST ${parsed.hostname} -> ${img}`);
      // still test reachability
    }
    const res = await headOrGet(img);
    if (!res.ok) {
      unreachable++;
      console.log(`- ${id}: UNREACHABLE (${res.status || res.error}) -> ${img}`);
    } else {
      ok++;
    }
  }

  console.log("\nSummary:");
  console.log(`  OK:          ${ok}`);
  console.log(`  MISSING:     ${missing}`);
  console.log(`  INVALID:     ${invalid}`);
  console.log(`  DISALLOWED:  ${disallowed}`);
  console.log(`  UNREACHABLE: ${unreachable}`);
})();

