#!/usr/bin/env node
// Importador de productos desde scraping AliExpress (sin RapidAPI)
// - Lee un JSON generado por scripts/aliexpress_scraper.py (o URLs descubiertas + scrapeadas)
// - Inserta nuevos productos en 'products' con una categoría destino fija
// - Crea el vínculo en 'products_external' con source='aliexpress'
//
// Uso:
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//   node scripts/import_scraped_to_supabase.mjs \
//     --input scripts/out/ae_mascotas.json \
//     --category mascotas \
//     [--limit 50] [--dry-run] \
//     [--usd-to-clp 950] [--eur-to-clp 1050]
//
// Notas:
// - Requiere Service Role para escribir en 'products' y 'products_external'.
// - Evita duplicados revisando si existe un 'products_external.url' = URL del ítem.
// - Convierte precios a CLP usando currency del scrape o los factores provistos.

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables desde .env.local y .env si existen
try { dotenv.config({ path: path.resolve('.env.local') }); } catch {}
try { dotenv.config({ path: path.resolve('.env') }); } catch {}

function parseArgs(argv) {
  const args = { usdToClp: 950, eurToClp: 1050, dryRun: false, limit: 0, enrichHeadless: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input') args.input = argv[++i];
    else if (a === '--category') args.category = argv[++i];
    else if (a === '--limit') args.limit = parseInt(argv[++i], 10) || 0;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--usd-to-clp') args.usdToClp = Number(argv[++i]) || args.usdToClp;
    else if (a === '--eur-to-clp') args.eurToClp = Number(argv[++i]) || args.eurToClp;
    else if (a === '--enrich-headless') args.enrichHeadless = true;
  }
  if (!args.input || !fs.existsSync(args.input)) {
    console.error('ERROR: --input <file.json> es requerido y debe existir');
    process.exit(1);
  }
  if (!args.category) {
    console.error('ERROR: --category <slug> es requerido (categoría destino en tu tienda)');
    process.exit(1);
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('ERROR: define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  return { ...args, supabase: createClient(url, key, { auth: { persistSession: false } }) };
}

function toClp(price, currency, rates) {
  const p = Number(price);
  if (!isFinite(p) || p <= 0) return null;
  const curr = (currency || '').toUpperCase();
  if (curr === 'CLP') return Math.round(p);
  if (curr === 'USD') return Math.round(p * rates.usdToClp);
  if (curr === 'EUR') return Math.round(p * rates.eurToClp);
  // Desconocida: asumir USD
  return Math.round(p * rates.usdToClp);
}

function firstImage(images) {
  if (!images) return null;
  if (Array.isArray(images) && images.length) return String(images[0]);
  if (typeof images === 'string' && images) return images;
  return null;
}

function extractAeIdFromUrl(url) {
  const m = String(url || '').match(/\/item\/(\d+)\.html/);
  return m ? m[1] : null;
}

async function ensureNotDuplicateByUrl(supabase, url) {
  const { data, error } = await supabase
    .from('products_external')
    .select('id')
    .eq('source', 'aliexpress')
    .eq('url', url)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return !data; // true si no existe
}

async function insertProductWithExternal(supabase, item, categorySlug, rates, dryRun) {
  // Campos del scrape
  const url = item.url || item.ae_url;
  const title = item.title || item.ae_title || 'Producto AliExpress';
  const price = item.price ?? item.ae_price;
  const currency = item.currency || item.ae_currency || 'USD';
  const images = item.images || (item.ae_image ? [item.ae_image] : []);

  const image_url = firstImage(images) || '/lunaria-icon.png';
  // normalizar slug de categoría (minúsculas, sin espacios)
  const normCategory = String(categorySlug || 'otros').toLowerCase().replace(/\s+/g, '_');
  const price_cents = toClp(price, currency, rates);
  const name = String(title).slice(0, 200);
  const name_es = name;

  if (!url) throw new Error('item sin url');
  if (!price_cents) throw new Error('item sin precio válido');

  // Insert en products
  const prod = {
    name,
    name_es,
    image_url,
    price_cents,
    category_slug: normCategory,
    description: name,
    description_es: name,
    short_desc_es: name,
    long_desc_es: name,
    envio: 'Envío estándar',
    envio_gratis: false,
    destacado: false,
    sales: 0,
    has_variants: false,
    has_video: false,
    images: Array.isArray(images) ? images.filter(Boolean) : [],
  };

  if (dryRun) {
    return { product_id: '(dry-run)', external_id: '(dry-run)' };
  }

  const { data: inserted, error: insErr } = await supabase
    .from('products')
    .insert(prod)
    .select('id')
    .single();
  if (insErr) throw insErr;

  const productId = inserted.id;
  const extRow = {
    product_id: productId,
    source: 'aliexpress',
    external_id: extractAeIdFromUrl(url),
    url,
    title: title,
    price: Number(price) || null,
    currency: currency || null,
    store: null,
    orders: null,
    updated_at: new Date().toISOString(),
  };

  const { error: upErr } = await supabase
    .from('products_external')
    .upsert(extRow, { onConflict: 'product_id,source' });
  if (upErr) throw upErr;

  return { product_id: productId, external_id: extRow.external_id };
}

async function main() {
  const args = parseArgs(process.argv);
  const supabase = args.supabase;

  const raw = JSON.parse(fs.readFileSync(args.input, 'utf8'));
  const list = Array.isArray(raw) ? raw : raw.items || [];
  const slice = args.limit ? list.slice(0, args.limit) : list;

  if (args.enrichHeadless) {
    let chromium;
    try { ({ chromium } = await import('playwright')); }
    catch {
      console.error('Falta playwright. Instala con:\n  npm i -D playwright && npx playwright install chromium');
      process.exit(1);
    }
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ locale: 'es-ES' });
    const page = await context.newPage();
    for (let i = 0; i < slice.length; i++) {
      const it = slice[i];
      const url = it.url || it.ae_url;
      if (!url) continue;
      const needsTitle = !it.title || String(it.title).trim().toLowerCase() === 'aliexpress';
      const needsPrice = it.price == null || !it.currency;
      if (!needsTitle && !needsPrice) continue;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(400);
        const data = await page.evaluate(() => {
          const pick = (sel) => document.querySelector(sel)?.getAttribute('content') || null;
          const ogTitle = pick('meta[property="og:title"]');
          const ogPrice = pick('meta[property="og:price:amount"]');
          const ogCurr = pick('meta[property="og:price:currency"]');
          const h1 = document.querySelector('h1')?.textContent?.trim() || null;
          let ldTitle = null, ldPrice = null, ldCurr = null;
          for (const n of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
            try {
              const j = JSON.parse(n.textContent || '{}');
              const arr = Array.isArray(j) ? j : [j];
              for (const x of arr) {
                if (x && (x['@type'] === 'Product' || (Array.isArray(x['@type']) && x['@type'].includes('Product')))) {
                  if (!ldTitle && typeof x.name === 'string') ldTitle = x.name;
                  const offers = x.offers;
                  if (offers && typeof offers === 'object') {
                    if (offers.price != null) ldPrice = Number(offers.price);
                    if (offers.priceCurrency) ldCurr = String(offers.priceCurrency);
                  }
                }
              }
            } catch {}
          }
          return { ogTitle, ogPrice, ogCurr, h1, ldTitle, ldPrice, ldCurr };
        });
        if (needsTitle) {
          const t = data.ldTitle || data.ogTitle || data.h1 || it.title;
          if (t && String(t).trim().toLowerCase() !== 'aliexpress') it.title = t;
        }
        if (needsPrice) {
          const p = data.ldPrice != null ? Number(data.ldPrice) : (data.ogPrice != null ? Number(data.ogPrice) : null);
          const c = data.ldCurr || data.ogCurr || it.currency || null;
          if (p != null) { it.price = p; it.currency = c || 'USD'; }
        }
      } catch {}
    }
    await context.close();
    await browser.close();
  }

  let ok = 0, dup = 0, fail = 0;
  for (let i = 0; i < slice.length; i++) {
    const it = slice[i];
    const url = it.url || it.ae_url;
    try {
      if (!url) throw new Error('sin url');
      const isNew = await ensureNotDuplicateByUrl(supabase, url);
      if (!isNew) { dup++; process.stdout.write(`\r[${i + 1}/${slice.length}] DUP `); continue; }

      const res = await insertProductWithExternal(
        supabase,
        it,
        args.category,
        { usdToClp: args.usdToClp, eurToClp: args.eurToClp },
        args.dryRun,
      );
      ok++;
      process.stdout.write(`\r[${i + 1}/${slice.length}] OK ${res.product_id}`);
    } catch (e) {
      fail++;
      process.stdout.write(`\r[${i + 1}/${slice.length}] FAIL: ${e?.message || e}`);
    }
  }

  process.stdout.write(`\nDONE ok=${ok} dup=${dup} fail=${fail}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
