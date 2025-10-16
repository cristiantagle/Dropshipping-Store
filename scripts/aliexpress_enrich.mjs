#!/usr/bin/env node
// Simple AliExpress enrichment via RapidAPI (or placeholder for official API)
// Usage:
//   node scripts/aliexpress_enrich.mjs --input scripts/cj_products.sample.json --out scripts/out/aliexpress_enriched.json --lang es
// Env:
//   RAPIDAPI_KEY=...           (if using RapidAPI provider)
//   AE_PROVIDER=rapidapi|none  (default: rapidapi)

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input') args.input = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--lang') args.lang = argv[++i];
    else if (a === '--limit') args.limit = parseInt(argv[++i], 10) || 20;
    else if (a === '--provider') args.provider = argv[++i];
  }
  return { input: args.input, out: args.out ?? 'scripts/out/aliexpress_enriched.json', lang: args.lang ?? 'es', limit: args.limit ?? 20, provider: args.provider ?? (process.env.AE_PROVIDER || 'rapidapi') };
}

async function searchAliExpressRapidAPI(q, { page = 1, lang = 'es' } = {}) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) {
    throw new Error('RAPIDAPI_KEY missing. Set it in your environment.');
  }
  // Note: RapidAPI has multiple AliExpress providers. Adjust host/path if needed.
  const url = new URL('https://aliexpress-datahub.p.rapidapi.com/item_search');
  url.searchParams.set('q', q);
  url.searchParams.set('page', String(page));
  // Some providers support 'country'/'currency'/'sort'. Keep minimal.
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': url.host,
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`AliExpress search failed: ${res.status} ${res.statusText} ${txt}`);
  }
  const data = await res.json();
  // Normalize a common shape
  const items = data?.result || data?.items || data?.data || [];
  return items.map((it) => ({
    id: String(it.product_id || it.item_id || it.id || ''),
    title: String(it.title || it.subject || ''),
    price: Number(it.sale_price || it.price || it.salePrice || 0),
    currency: it.currency || it.currency_code || 'USD',
    image: it.image || it.image_url || it.pic_url || it.thumb || null,
    url: it.url || it.product_url || it.detail_url || null,
    rating: it.rating || it.star_rating || null,
    storeName: it.store_name || it.shop || null,
    orders: it.orders || it.sales || null,
  }));
}

function fuzzyScore(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase(); b = b.toLowerCase();
  let score = 0;
  for (const token of a.split(/\s+/)) {
    if (b.includes(token)) score += Math.min(token.length, 6);
  }
  return score;
}

async function enrichOne(item, provider, lang) {
  const q = item.name_es || item.name || '';
  if (!q) return { ...item, _enrich: { status: 'skipped', reason: 'no-name' } };
  let results = [];
  if (provider === 'rapidapi') {
    results = await searchAliExpressRapidAPI(q, { lang });
  } else {
    return { ...item, _enrich: { status: 'skipped', reason: 'no-provider' } };
  }
  // Rank by fuzzy score vs. CJ name; prefer similar price if available
  const basePrice = Number(item.price_cents ? item.price_cents / 100 : 0);
  results.forEach((r) => {
    r._score = fuzzyScore(q, r.title) + (basePrice > 0 && r.price > 0 ? (Math.max(0, 1 - Math.abs(r.price - basePrice) / Math.max(basePrice, r.price))) * 5 : 0);
  });
  const best = results.sort((a, b) => (b._score ?? 0) - (a._score ?? 0))[0];
  if (!best) return { ...item, _enrich: { status: 'no-match', tried: results.length } };
  return {
    ...item,
    enriched: {
      ae_id: best.id,
      ae_title: best.title,
      ae_price: best.price,
      ae_currency: best.currency,
      ae_image: best.image,
      ae_url: best.url,
      ae_rating: best.rating,
      ae_store: best.storeName,
      ae_orders: best.orders,
      provider: 'aliexpress:rapidapi',
    },
    _enrich: { status: 'ok', tried: results.length },
  };
}

async function main() {
  const { input, out, lang, limit, provider } = parseArgs(process.argv);
  if (!input || !fs.existsSync(input)) {
    console.error('ERROR: --input <file.json> is required.');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(input, 'utf8'));
  const items = Array.isArray(raw) ? raw : raw.items || [];
  if (!Array.isArray(items) || items.length === 0) {
    console.error('ERROR: input must be an array of items.');
    process.exit(1);
  }
  const slice = items.slice(0, limit);
  const outDir = path.dirname(out);
  fs.mkdirSync(outDir, { recursive: true });

  const enriched = [];
  for (let i = 0; i < slice.length; i++) {
    const it = slice[i];
    try {
      const res = await enrichOne(it, provider, lang);
      enriched.push(res);
      process.stdout.write(`\r[${i + 1}/${slice.length}] ${it.name_es || it.name || it.id}`);
    } catch (e) {
      enriched.push({ ...it, _enrich: { status: 'error', message: String(e?.message || e) } });
    }
  }
  fs.writeFileSync(out, JSON.stringify(enriched, null, 2), 'utf8');
  process.stdout.write(`\nWrote ${enriched.length} items to ${out}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => { console.error(err); process.exit(1); });
}

