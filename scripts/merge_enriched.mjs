#!/usr/bin/env node
// Merge AliExpress enriched results into Supabase
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//   node scripts/merge_enriched.mjs --input scripts/out/aliexpress_enriched.json [--update-images] [--limit 100] [--dry-run]

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

function parseArgs(argv) {
  const args = { updateImages: false, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input') args.input = argv[++i];
    else if (a === '--limit') args.limit = parseInt(argv[++i], 10) || 0;
    else if (a === '--update-images') args.updateImages = true;
    else if (a === '--dry-run') args.dryRun = true;
  }
  return args;
}

function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

async function main() {
  const { input, limit, updateImages, dryRun } = parseArgs(process.argv);
  if (!input || !fs.existsSync(input)) {
    console.error('ERROR: --input <file.json> is required.');
    process.exit(1);
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('ERROR: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const items = JSON.parse(fs.readFileSync(input, 'utf8'));
  const list = (Array.isArray(items) ? items : items.items || []).filter(Boolean);
  const slice = limit ? list.slice(0, limit) : list;

  let ok = 0, fail = 0, skipped = 0;
  for (let i = 0; i < slice.length; i++) {
    const it = slice[i];
    const id = it.id || it.product_id || it.productId;
    const enr = it.enriched;
    const status = it._enrich?.status;
    if (!id || status !== 'ok' || !enr) { skipped++; continue; }

    const extRow = {
      product_id: id,
      source: 'aliexpress',
      external_id: enr.ae_id || null,
      url: enr.ae_url || null,
      title: enr.ae_title || null,
      rating: enr.ae_rating ?? null,
      price: enr.ae_price ?? null,
      currency: enr.ae_currency || null,
      store: enr.ae_store || null,
      orders: enr.ae_orders ?? null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (!dryRun) {
        // Upsert into products_external
        const { error: upErr } = await supabase
          .from('products_external')
          .upsert(extRow, { onConflict: 'product_id,source' });
        if (upErr) throw upErr;

        // Optionally update products.images with AE image (append if missing)
        if (updateImages && enr.ae_image) {
          const { data: prod, error: selErr } = await supabase
            .from('products')
            .select('id, images')
            .eq('id', id)
            .single();
          if (!selErr && prod) {
            const current = Array.isArray(prod.images) ? prod.images : [];
            const merged = uniq([...(current || []), enr.ae_image]);
            if (merged.length !== current.length) {
              await supabase.from('products').update({ images: merged }).eq('id', id);
            }
          }
        }
      }
      ok++;
      process.stdout.write(`\r[${i + 1}/${slice.length}] OK ${id}`);
    } catch (e) {
      fail++;
      process.stdout.write(`\r[${i + 1}/${slice.length}] FAIL ${id}: ${e?.message || e}`);
    }
  }
  process.stdout.write(`\nDONE. ok=${ok} fail=${fail} skipped=${skipped}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

