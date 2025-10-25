import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

type IncomingItem = {
  title?: string;
  description?: string;
  images?: string[] | string;
  price?: number | string;
  currency?: string;
  url?: string;
  host?: string;
  store?: string;
  orders?: number | string;
  rating?: number | string;
  productId?: string | number;
  categoryId?: string | number;
  category_slug?: string;
  attributes?: Array<{ name?: string; value?: string }>;
  variants?: Array<any>;
  shipping?: any;
};

function firstImage(images: IncomingItem['images']) {
  if (!images) return null;
  if (Array.isArray(images) && images.length) return String(images[0]);
  if (typeof images === 'string' && images) return images;
  return null;
}

function applyMarkupClp(value: unknown, markup = 0.4) {
  const p = Number(value);
  if (!Number.isFinite(p) || p <= 0) return null;
  const factor = 1 + Number(markup || 0);
  return Math.round(p * factor);
}

function normSlug(s: unknown) {
  return String(s || 'otros')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

async function mapCategoryByAeId(
  sb: ReturnType<typeof supabaseAdmin>,
  aeCategoryId?: string | number,
) {
  if (!aeCategoryId) return null;
  try {
    const { data, error } = await sb
      .from('ae_category_map')
      .select('category_slug')
      .eq('ae_category_id', String(aeCategoryId))
      .limit(1)
      .maybeSingle();
    if (error) return null;
    return data?.category_slug || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  const allowed = (process.env.IMPORT_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowed.length && origin && origin !== 'null' && !allowed.includes(origin)) {
    return NextResponse.json(
      { error: 'forbidden' },
      { status: 403, headers: { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } },
    );
  }
  const tokenEnv = process.env.IMPORT_API_TOKEN;
  if (tokenEnv) {
    const hdr = req.headers.get('x-import-token');
    if (!hdr || hdr !== tokenEnv) {
      return NextResponse.json(
        { error: 'unauthorized' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } },
      );
    }
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const items: IncomingItem[] = Array.isArray(body?.items)
    ? body.items
    : Array.isArray(body)
      ? body
      : [];
  const defaultCategory: string | undefined = body?.default_category;
  const useCategoryMap: boolean = Boolean(body?.use_category_map);
  const source: string = String(body?.source || 'aliexpress');
  const markupPercent = Number(body?.markup_percent);
  const markup = Number.isFinite(markupPercent) ? markupPercent : 0.4; // Global 40% por defecto

  if (!items.length) {
    return NextResponse.json(
      { error: 'no_items' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } },
    );
  }

  const sb = supabaseAdmin();

  const results: any[] = [];
  for (const it of items) {
    const url = it.url;
    if (!url) {
      results.push({ ok: false, reason: 'missing_url' });
      continue;
    }
    // Duplicate check
    const { data: existsRow, error: existsErr } = await sb
      .from('products_external')
      .select('id, product_id')
      .eq('source', source)
      .eq('url', url)
      .limit(1)
      .maybeSingle();
    if (existsErr) {
      results.push({ ok: false, url, reason: 'exists_check_error' });
      continue;
    }
    if (existsRow) {
      results.push({ ok: true, url, skipped: 'duplicate', product_id: existsRow.product_id });
      continue;
    }

    const title = it.title || 'Producto';
    // Precio viene en CLP desde el scraper; aplicar markup global 40% (configurable)
    const priceCents = applyMarkupClp(it.price, markup);
    if (!priceCents) {
      results.push({ ok: false, url, reason: 'invalid_price' });
      continue;
    }
    const image_url = firstImage(it.images) || '/lunaria-icon.png';

    let categorySlug = it.category_slug || defaultCategory || null;
    if (!categorySlug && useCategoryMap) {
      categorySlug = await mapCategoryByAeId(sb, it.categoryId ?? undefined);
    }
    const normCategory = normSlug(categorySlug);

    const product = {
      name: String(title).slice(0, 200),
      name_es: String(title).slice(0, 200),
      image_url,
      price_cents: priceCents,
      category_slug: normCategory,
      description: title,
      description_es: title,
      short_desc_es: title,
      long_desc_es: title,
      envio: 'Envío estándar',
      envio_gratis: Boolean(it.shipping?.freeShipping) || false,
      destacado: false,
      sales: 0,
      has_variants: Array.isArray(it.variants) && it.variants.length > 0,
      has_video: false,
      images: Array.isArray(it.images) ? it.images.filter(Boolean) : [],
    } as const;

    const { data: inserted, error: insErr } = await sb
      .from('products')
      .insert(product)
      .select('id')
      .single();
    if (insErr) {
      results.push({ ok: false, url, reason: 'insert_error' });
      continue;
    }
    const productId = inserted.id;
    const ext = {
      product_id: productId,
      source,
      external_id: String(it.productId || ''),
      url,
      title: title,
      price: Number(it.price) || null,
      currency: it.currency || null,
      store: it.store || null,
      orders: Number(it.orders) || null,
      updated_at: new Date().toISOString(),
    };
    const { error: extErr } = await sb
      .from('products_external')
      .upsert(ext, { onConflict: 'product_id,source' });
    if (extErr) {
      results.push({ ok: false, url, reason: 'external_upsert_error', product_id: productId });
      continue;
    }
    results.push({ ok: true, url, product_id: productId });
  }

  return NextResponse.json(
    { ok: true, count: results.length, results },
    { headers: { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } },
  );
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Import-Token',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
}
