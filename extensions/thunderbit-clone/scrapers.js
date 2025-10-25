// TB_SCRAPER: Extracts structured data from pages using JSON-LD, OpenGraph and common DOM patterns.
// Exposes window.TB_SCRAPER.scrape() returning a normalized object.

(function initTBScraper() {
  if (window.TB_SCRAPER) return; // idempotent

  const HOST = location.host || '';
  const IS_AE = /(^|\.)aliexpress\./i.test(HOST);

  function safeParseJSON(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function findJsonLdProducts() {
    const scripts = Array.from(
      document.querySelectorAll(
        'script[type="application/ld+json"], script[type="application/json+ld"]',
      ),
    );
    const out = [];
    for (const s of scripts) {
      const txt = s.textContent?.trim();
      if (!txt) continue;
      const data = safeParseJSON(txt);
      if (!data) continue;
      const arr = Array.isArray(data)
        ? data
        : data['@graph'] && Array.isArray(data['@graph'])
          ? data['@graph']
          : [data];
      for (const node of arr) {
        const t = (node['@type'] || node.type || '').toString();
        if (/Product/i.test(t)) out.push(node);
      }
    }
    return out;
  }

  function extractFromJsonLd(prod) {
    const offers = Array.isArray(prod.offers) ? prod.offers[0] : prod.offers || {};
    const images = [];
    if (Array.isArray(prod.image)) images.push(...prod.image);
    if (typeof prod.image === 'string') images.push(prod.image);
    return {
      title: prod.name || '',
      description: prod.description || '',
      images,
      price: offers.price || offers.priceSpecification?.price || '',
      currency: offers.priceCurrency || offers.priceSpecification?.priceCurrency || '',
      availability: offers.availability || '',
      sku: prod.sku || '',
      brand: typeof prod.brand === 'string' ? prod.brand : prod.brand?.name || '',
      gtin: prod.gtin13 || prod.gtin || prod.gtin8 || prod.gtin12 || '',
    };
  }

  function extractOpenGraph() {
    const og = (prop) => document.querySelector(`meta[property="${prop}"]`)?.content || '';
    const title = og('og:title');
    const description = og('og:description');
    const imageEls = Array.from(
      document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]'),
    );
    const images = imageEls.map((m) => m.content).filter(Boolean);
    const price = document.querySelector('meta[property="product:price:amount"]')?.content || '';
    const currency =
      document.querySelector('meta[property="product:price:currency"]')?.content || '';
    return { title, description, images, price, currency };
  }

  function extractCommonDOM() {
    const title = document.querySelector('h1')?.textContent?.trim() || document.title || '';
    // Price heuristics
    const priceSelectors = [
      '[itemprop="price"]',
      '[data-price]',
      '[data-product-price]',
      '.price',
      '.product-price',
      '.price__current',
    ];
    let price = '';
    for (const sel of priceSelectors) {
      const el = document.querySelector(sel);
      if (el?.getAttribute('content')) {
        price = el.getAttribute('content');
        break;
      }
      if (el?.textContent) {
        price = el.textContent.replace(/[^0-9.,]/g, '').trim();
        if (price) break;
      }
    }
    // Currency heuristics
    const currency =
      document.querySelector('[itemprop="priceCurrency"]')?.getAttribute('content') || '';
    // Images (first product image likely)
    const imgEls = Array.from(document.querySelectorAll('img'))
      .map((img) => img.currentSrc || img.src)
      .filter(Boolean)
      .slice(0, 8);
    return { title, price, currency, images: imgEls };
  }

  // ---- AliExpress specific ----

  function aeCleanTitle(title) {
    if (!title) return '';
    return String(title)
      .replace(/\s*-\s*AliExpress.*$/i, '')
      .trim();
  }

  function num(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : undefined;
  }

  function aeParseIdsFromUrl() {
    const m =
      location.pathname.match(/\/item\/(\d+)\.html/i) || location.href.match(/itemId=(\d+)/i);
    return m ? m[1] : '';
  }

  function aeBuildSku(ml) {
    const out = { properties: [], variations: [] };
    if (!ml) return out;
    const propList = ml.skuPropertyList || [];
    const priceList = ml.skuPriceList || [];
    const propIdName = new Map();
    const valIdInfo = new Map(); // key: `${pid}:${vid}` -> {propName, valueName, imageUrl}
    for (const p of propList) {
      const pid = String(p.skuPropertyId ?? p.propertyId ?? '');
      const pname = p.skuPropertyName || p.propertyName || '';
      if (!pid) continue;
      propIdName.set(pid, pname);
      const values = Array.isArray(p.skuPropertyValues || p.values)
        ? p.skuPropertyValues || p.values
        : [];
      for (const v of values) {
        const vid = String(v.propertyValueId ?? v.skuPropertyValueId ?? v.valueId ?? '');
        const vname =
          v.propertyValueDisplayName ||
          v.propertyValueName ||
          v.skuPropertyValueName ||
          v.name ||
          '';
        const img = v.imageUrl || v.skuPropertyImagePath || '';
        if (vid)
          valIdInfo.set(`${pid}:${vid}`, { propName: pname, valueName: vname, imageUrl: img });
      }
      out.properties.push({ id: pid, name: pname });
    }
    for (const it of priceList) {
      const ids = String(it.skuPropIds || it.skuAttr || '')
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
      const props = {};
      for (const pair of ids) {
        const [pid, vid] = pair.split(':');
        const info = valIdInfo.get(`${pid}:${vid}`);
        if (info) props[info.propName] = info.valueName;
      }
      const price =
        it.skuActivityAmount?.value ??
        it.skuActAmount?.value ??
        it.skuAmount?.value ??
        it.actSkuMultiCurrencyCalPrice?.value ??
        it.skuMultiCurrencyCalPrice?.value;
      const currency =
        it.skuActivityAmount?.currency ||
        it.skuActAmount?.currency ||
        it.skuAmount?.currency ||
        it.actSkuMultiCurrencyCalPrice?.currency ||
        it.skuMultiCurrencyCalPrice?.currency ||
        '';
      const stock = it.availQuantity ?? it.inventory ?? it.quantity;
      out.variations.push({
        skuId: it.skuIdStr || it.skuId || '',
        props,
        price: price !== undefined ? String(price) : '',
        currency,
        stock: num(stock),
        available: typeof stock === 'number' ? stock > 0 : undefined,
      });
    }
    return out;
  }

  function aeExtractAttributes(data) {
    const attrs = [];
    const src = data?.productPropVOList || data?.specsModule?.props || data?.props || [];
    for (const a of src) {
      const name = a.attrName || a.name || a.propName || a.attrNameEN || '';
      const value = a.attrValue || a.value || a.propValue || a.attrValueEN || '';
      if (name || value) attrs.push({ name, value });
    }
    return attrs;
  }

  function aeFromRunParams(rp) {
    if (!rp) return {};
    const data = rp.data || rp.initialData || rp;
    const title = data?.titleModule?.subject || data?.title || data?.pageModule?.title || '';
    const imgArr =
      data?.imageModule?.images || data?.imageModule?.imagePathList || data?.imagePathList || [];
    const images = Array.isArray(imgArr) ? imgArr : [];
    const pm = data?.priceModule || {};
    const price =
      pm.formatedPrice || pm.minActivityAmount?.value || pm.minPrice || pm.formattedPrice || '';
    const priceMin = pm.minActivityAmount?.value ?? pm.minAmount?.value ?? pm.minPrice ?? undefined;
    const priceMax = pm.maxActivityAmount?.value ?? pm.maxAmount?.value ?? pm.maxPrice ?? undefined;
    const originalMin = pm.minAmount?.value ?? undefined;
    const originalMax = pm.maxAmount?.value ?? undefined;
    const currency = pm.minActivityAmount?.currency || pm.minAmount?.currency || pm.currency || '';
    const store = data?.storeModule?.storeName || data?.sellerModule?.storeName || '';
    const storeId =
      data?.storeModule?.storeNum ||
      data?.storeModule?.storeId ||
      data?.sellerModule?.storeId ||
      '';
    const storeUrl = data?.storeModule?.storeURL || data?.sellerModule?.storeUrl || '';
    const sellerId = data?.sellerModule?.sellerAdminSeq || data?.sellerModule?.sellerId || '';
    const categoryId =
      data?.pageModule?.categoryId || data?.crossLinkModule?.productCategoryId || '';
    const rating =
      data?.titleModule?.feedbackRating?.averageStarRating || data?.feedback?.averageStarRate || '';
    const reviewCount =
      data?.titleModule?.feedbackRating?.totalValidNum || data?.feedback?.totalValidNum || '';
    const orders = data?.titleModule?.tradeCount || data?.tradeCount || '';
    const productId =
      data?.pageModule?.productId || data?.rootProductId || data?.productId || aeParseIdsFromUrl();

    // SKU/Variants
    const sku = aeBuildSku(data?.skuModule);

    const discountPercent = (() => {
      const min = num(priceMin) ?? num(price);
      const orig = num(originalMin);
      if (min && orig && orig > 0) return Math.round((1 - min / orig) * 100);
      return undefined;
    })();

    return {
      title: aeCleanTitle(title),
      images,
      price: price?.toString?.() || price || '',
      currency: currency || '',
      priceMin: priceMin ?? undefined,
      priceMax: priceMax ?? undefined,
      originalMin: originalMin ?? undefined,
      originalMax: originalMax ?? undefined,
      discountPercent,
      store,
      storeId: storeId?.toString?.() || storeId || '',
      storeUrl,
      sellerId: sellerId?.toString?.() || sellerId || '',
      categoryId: categoryId?.toString?.() || categoryId || '',
      rating: rating?.toString?.() || rating || '',
      reviewCount: reviewCount?.toString?.() || reviewCount || '',
      orders: orders?.toString?.() || orders || '',
      productId: productId?.toString?.() || productId || '',
      attributes: aeExtractAttributes(data),
      variants: sku.variations,
      variantProperties: sku.properties,
    };
  }

  function aeFromDOM() {
    const title = aeCleanTitle(
      document.querySelector('h1.product-title-text')?.textContent?.trim() ||
        document.querySelector('#root h1')?.textContent?.trim() ||
        document.querySelector('meta[property="og:title"]')?.content ||
        document.title,
    );
    const priceEl =
      document.querySelector(
        '.product-price-current, .product-price-value, [itemprop="price"], .product-price',
      ) || null;
    let price = '';
    if (priceEl) {
      price = priceEl.getAttribute('content') || priceEl.textContent || '';
      price = price.replace(/[^0-9.,]/g, '').trim();
    }
    const currency =
      document.querySelector('meta[property="product:price:currency"]')?.content || '';
    const imgs = Array.from(document.querySelectorAll('img'))
      .map((i) => i.currentSrc || i.src)
      .filter((u) => /alicdn\.com|aliexpress\./i.test(u || ''))
      .slice(0, 12);
    const store = document.querySelector('.store-name, a.store-name')?.textContent?.trim() || '';
    const rating =
      document
        .querySelector('.overview-rating-average, .product-reviewer-rating')
        ?.textContent?.trim() || '';
    const ordersText =
      document.querySelector('[class*="-sold"], .product-reviewer-sold')?.textContent || '';
    const ordersMatch = ordersText.match(/([0-9,.]+)\s*(sold|orders|pedidos)/i);
    const orders = ordersMatch ? ordersMatch[1] : '';
    return { title, price, currency, images: imgs, store, rating, orders };
  }

  function aeExtractGallery(rp, dc) {
    const imgs = [];
    const im = rp?.data?.imageModule || rp?.imageModule || {};
    const pushAll = (arr) => {
      if (Array.isArray(arr)) imgs.push(...arr);
    };
    pushAll(im.images);
    pushAll(im.imagePathList);
    pushAll(im.summImagePathList);
    // DCData (mobile/alt): imagePathList, summImagePathList
    pushAll(dc?.imagePathList);
    pushAll(dc?.summImagePathList);
    // Deduplicate and normalize protocol
    const seen = new Set();
    const out = [];
    for (let u of imgs) {
      if (!u) continue;
      if (u.startsWith('//')) u = location.protocol + u;
      if (!seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }
    return out;
  }

  function aeExtractShippingFromRunParams(data) {
    const dm = data?.deliveryModule || data?.logisticsModule || data?.shippingModule || null;
    if (!dm) return {};
    const feeCandidates = [
      dm.freight?.amount,
      dm.freightAmount,
      dm.minFreightAmount,
      dm.shippingFee,
      dm.freightFee,
    ].filter(Boolean);
    let feeVal, feeCur;
    for (const f of feeCandidates) {
      const v = typeof f === 'object' ? (f.value ?? f.amount ?? f.min ?? f.max) : f;
      const c = typeof f === 'object' ? f.currency || f.ccy : undefined;
      if (v !== undefined) {
        feeVal = v;
        feeCur = feeCur || c;
        break;
      }
    }
    const isFree = Boolean(dm.isFreeShipping || dm.freeShipping || feeVal === 0);
    const est = dm.deliveryTime || dm.estimateDeliveryTime || dm.time || '';
    const shipsFrom = dm.sendGoodsCountryName || dm.sendGoodsCountryCode || dm.warehouse || '';
    const company = dm.logisticsCompany || dm.company || '';
    return {
      freeShipping: isFree,
      shippingFeeMin: feeVal !== undefined ? Number(feeVal) : undefined,
      shippingCurrency: feeCur || dm.currency || '',
      estimated: est || undefined,
      shipsFrom: shipsFrom || undefined,
      company: company || undefined,
    };
  }

  function aeExtractShippingFromDOM() {
    const text = (sel) =>
      Array.from(document.querySelectorAll(sel))
        .map((el) => el.textContent || '')
        .join(' \n ');
    const t = text(
      '[class*="ship"], [class*="Ship"], [class*="envio"], [class*="Envío"], [class*="freight"], [class*="delivery"], [class*="Delivery"], .product-shipping, .store-delivery',
    );
    const freeShipping = /free\s*shipping|env[ií]o\s+gratis/i.test(t);
    const feeMatch = t.match(/([\$€£]|USD|EUR|CLP)\s*([0-9]+[0-9.,]*)/i);
    const daysMatch = t.match(/(\d+\s*[-–]\s*\d+|\d+)\s*(days|d[ií]as)/i);
    const shipsFromMatch =
      t.match(/ships?\s*from\s*[:\-]?\s*([\w\s]+)/i) ||
      t.match(/env[ií]a\s*desde\s*[:\-]?\s*([\w\s]+)/i);
    return {
      freeShipping: freeShipping || undefined,
      shippingFeeMin: feeMatch
        ? Number((feeMatch[2] || '').replace(/[^0-9.,]/g, '').replace(/,/g, '.'))
        : undefined,
      shippingCurrency: feeMatch ? feeMatch[1] || '' : undefined,
      estimated: daysMatch ? daysMatch[0] : undefined,
      shipsFrom: shipsFromMatch ? shipsFromMatch[1].trim() : undefined,
    };
  }

  function mergePreferring(a, b) {
    const out = { ...a };
    for (const k of Object.keys(b)) {
      const va = out[k];
      const vb = b[k];
      if (!vb) continue;
      if (!va || (Array.isArray(vb) && (!Array.isArray(va) || va.length === 0))) out[k] = vb;
    }
    return out;
  }

  function scrapeWithHints(hintsRunParams = null, hintsDCData = null) {
    let result = {
      title: '',
      description: '',
      images: [],
      price: '',
      currency: '',
      availability: '',
      sku: '',
      brand: '',
      gtin: '',
      url: location.href,
      host: location.host,
    };
    // Site-specific: AliExpress first
    if (IS_AE) {
      if (hintsRunParams) result = mergePreferring(result, aeFromRunParams(hintsRunParams));
      result = mergePreferring(result, aeFromDOM());
      const shipRP = aeExtractShippingFromRunParams(hintsRunParams?.data || hintsRunParams);
      const shipDOM = aeExtractShippingFromDOM();
      result.shipping = {
        ...shipDOM,
        ...shipRP,
        freeShipping: shipRP?.freeShipping ?? shipDOM.freeShipping,
      };
      const gallery = aeExtractGallery(hintsRunParams, hintsDCData);
      if (gallery.length) result.images = gallery;
    }
    // JSON-LD Product first
    const prods = findJsonLdProducts();
    if (prods.length) {
      result = mergePreferring(result, extractFromJsonLd(prods[0]));
    }
    // OpenGraph
    result = mergePreferring(result, extractOpenGraph());
    // DOM Heuristics
    result = mergePreferring(result, extractCommonDOM());
    // Clean images (dedupe)
    if (Array.isArray(result.images)) {
      const seen = new Set();
      result.images = result.images.filter((u) => {
        if (!u || seen.has(u)) return false;
        seen.add(u);
        return true;
      });
    }
    return result;
  }

  function scrape() {
    return scrapeWithHints(null, null);
  }

  window.TB_SCRAPER = { scrape, scrapeWithHints };
})();
