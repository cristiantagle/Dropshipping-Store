async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function ensureInjected(tabId) {
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['scrapers.js'] });
    return true;
  } catch (e) {
    console.warn('Injection failed', e);
    return false;
  }
}

async function captureFromPage() {
  const tab = await getActiveTab();
  if (!tab?.id) return {};
  const [{ result } = {}] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const title =
        document.querySelector('meta[property="og:title"]')?.content ||
        document.title ||
        document.querySelector('h1')?.textContent?.trim() ||
        '';
      const description =
        document.querySelector('meta[name="description"]')?.content ||
        document.querySelector('meta[property="og:description"]')?.content ||
        '';
      const images = Array.from(document.querySelectorAll('meta[property="og:image"]'))
        .map((m) => m.content)
        .filter(Boolean);
      return { title, url: location.href, description, images, host: location.host };
    },
  });
  return result || {};
}

function updateCount() {
  chrome.storage.local.get({ records: [] }, (data) => {
    const countEl = document.querySelector('#count');
    countEl.textContent = (data.records || []).length.toString();
  });
}

function primaryImage(rec) {
  const imgs = Array.isArray(rec?.images) ? rec.images : [];
  return imgs.find((u) => typeof u === 'string' && u.startsWith('http')) || '';
}

function renderList(records) {
  try {
    const list = document.querySelector('#list');
    if (!list) return;
    list.innerHTML = '';
    const items = (Array.isArray(records) ? records : []).slice(0, 30);
    for (const r of items) {
      const el = document.createElement('div');
      el.className = 'item';
      const img = document.createElement('img');
      img.src =
        primaryImage(r) ||
        'data:image/svg+xml;charset=utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23fafafa%22/%3E%3C/svg%3E';
      const body = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = r.title || r.url || 'Producto';
      const meta = document.createElement('div');
      meta.className = 'meta';
      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = r.price ? `${r.price} ${r.currency || ''}` : '';
      const store = document.createElement('span');
      store.textContent = r.store ? `Tienda: ${r.store}` : '';
      const rating = document.createElement('span');
      rating.textContent = r.rating ? `★ ${r.rating}` : '';
      const orders = document.createElement('span');
      orders.textContent = r.orders ? `Pedidos: ${r.orders}` : '';
      meta.append(price, store, rating, orders);
      body.append(h3, meta);
      const side = document.createElement('div');
      side.className = 'muted';
      side.style.fontSize = '12px';
      side.textContent = r.ts ? new Date(r.ts).toLocaleString() : '';
      el.append(img, body, side);
      el.addEventListener('click', () => {
        if (r.url) chrome.tabs.create({ url: r.url, active: true });
      });
      list.appendChild(el);
    }
  } catch {}
}

async function refreshList() {
  try {
    const data = await chrome.storage.local.get({ records: [] });
    renderList(data.records || []);
  } catch {}
}

function loadSettings() {
  chrome.storage.local.get(
    {
      tb_settings: {
        apiUrl: '',
        apiToken: '',
        defaultCategory: '',
        useMap: true,
        autoRemove: true,
      },
    },
    (d) => {
      const s = d.tb_settings || {};
      const apiUrl = document.querySelector('#apiUrl');
      const apiToken = document.querySelector('#apiToken');
      const categorySelect = document.querySelector('#categorySelect');
      const useMap = document.querySelector('#useMap');
      const autoRemove = document.querySelector('#autoRemove');
      if (apiUrl) apiUrl.value = s.apiUrl || '';
      if (apiToken) apiToken.value = s.apiToken || '';
      if (categorySelect && s.defaultCategory) {
        categorySelect.dataset.selected = s.defaultCategory;
      }
      if (useMap) useMap.checked = Boolean(s.useMap);
      if (autoRemove) autoRemove.checked = s.autoRemove !== false;

      // Auto-derive API URL from active tab if empty
      (async () => {
        try {
          if (!apiUrl || apiUrl.value) return;
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tab?.url) return;
          const u = new URL(tab.url);
          // Evitar autoderivar desde dominios de scraping (ej. AliExpress)
          if (u.protocol.startsWith('http') && !/aliexpress\./i.test(u.hostname)) {
            const derived = `${u.origin}/api/import/products`;
            apiUrl.value = derived;
            // Persist the derived URL
            const existing = d.tb_settings || {};
            chrome.storage.local.set({ tb_settings: { ...existing, apiUrl: derived } });
          }
        } catch {}
      })();
    },
  );
}

async function loadCategories() {
  try {
    const sel = document.querySelector('#categorySelect');
    if (!sel) return;
    // Base origin desde apiUrl
    let origin = '';
    const apiUrl = document.querySelector('#apiUrl')?.value?.trim();
    if (apiUrl) {
      try {
        origin = new URL(apiUrl).origin;
      } catch {}
    }
    sel.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Elige categoría (opcional)';
    sel.appendChild(placeholder);

    let items = null;
    if (origin) {
      try {
        const res = await fetch(`${origin}/api/categories`);
        const json = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(json?.items)) items = json.items;
      } catch {}
    }
    // Fallback local si no se pudo cargar del backend
    if (!items) {
      items = [
        { slug: 'belleza', nombre: 'Belleza' },
        { slug: 'bienestar', nombre: 'Bienestar' },
        { slug: 'eco', nombre: 'Eco' },
        { slug: 'hogar', nombre: 'Hogar' },
        { slug: 'mascotas', nombre: 'Mascotas' },
        { slug: 'oficina', nombre: 'Oficina' },
        { slug: 'tecnologia', nombre: 'Tecnología' },
        { slug: 'ropa_hombre', nombre: 'Ropa Hombre' },
        { slug: 'ropa_mujer', nombre: 'Ropa Mujer' },
        { slug: 'accesorios', nombre: 'Accesorios' },
        { slug: 'otros', nombre: 'Otros' },
      ];
    }
    for (const c of items) {
      const o = document.createElement('option');
      o.value = c.slug;
      o.textContent = c.nombre || c.slug;
      sel.appendChild(o);
    }
    const selected = sel.dataset.selected;
    if (selected) sel.value = selected;
  } catch {}
}

async function testConnection() {
  const status = document.querySelector('#apiStatus');
  const apiUrl = document.querySelector('#apiUrl')?.value?.trim();
  if (!apiUrl) {
    if (status) status.textContent = 'Falta API URL';
    return false;
  }
  let origin = '';
  try {
    origin = new URL(apiUrl).origin;
  } catch {
    if (status) status.textContent = 'URL inválida';
    return false;
  }
  try {
    if (status) {
      status.textContent = 'Probando...';
      status.style.color = '#333';
    }
    const res = await fetch(`${origin}/api/categories`, { method: 'GET' });
    if (res.ok) {
      if (status) {
        status.textContent = 'Conexión OK';
        status.style.color = '#0a0';
      }
      return true;
    }
    if (status) {
      status.textContent = `Error ${res.status}`;
      status.style.color = '#b00';
    }
    return false;
  } catch (e) {
    if (status) {
      status.textContent = 'Sin conexión';
      status.style.color = '#b00';
    }
    return false;
  }
}

function saveSettings() {
  const apiUrl = document.querySelector('#apiUrl')?.value?.trim() || '';
  const apiToken = document.querySelector('#apiToken')?.value?.trim() || '';
  const defaultCategory = document.querySelector('#categorySelect')?.value?.trim() || '';
  const useMap = Boolean(document.querySelector('#useMap')?.checked);
  const autoRemove = Boolean(document.querySelector('#autoRemove')?.checked);
  chrome.storage.local.set({
    tb_settings: { apiUrl, apiToken, defaultCategory, useMap, autoRemove },
  });
}

async function removeImportedFromStorage(results) {
  const successUrls = (Array.isArray(results) ? results : [])
    .filter((r) => r && r.ok && !r.skipped && r.url)
    .map((r) => r.url);
  if (!successUrls.length) return;
  const data = await chrome.storage.local.get({ records: [] });
  const next = (Array.isArray(data.records) ? data.records : []).filter(
    (r) => !successUrls.includes(r.url),
  );
  await chrome.storage.local.set({ records: next });
}

async function sendToSupabase(items) {
  const { tb_settings } = await chrome.storage.local.get({ tb_settings: {} });
  const apiUrl = tb_settings?.apiUrl;
  if (!apiUrl) throw new Error('Configura API URL');
  const headers = { 'Content-Type': 'application/json' };
  if (tb_settings?.apiToken) headers['X-Import-Token'] = tb_settings.apiToken;
  const body = {
    items,
    default_category: tb_settings?.defaultCategory || undefined,
    use_category_map: Boolean(tb_settings?.useMap),
    source: 'aliexpress',
    usd_to_clp: 950,
    eur_to_clp: 1050,
  };
  const res = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
  return json;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCount();
  refreshList();
  loadSettings();
  loadCategories();
  // Persist settings on change
  ['#apiUrl', '#apiToken', '#categorySelect', '#useMap'].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el)
      el.addEventListener('change', async () => {
        saveSettings();
        if (sel === '#apiUrl') await testConnection();
      });
  });
  document.querySelector('#testApi')?.addEventListener('click', testConnection);
  document.querySelector('#limit')?.addEventListener('change', () => {});
  document.querySelector('#openPanel')?.addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'TB_TOGGLE_PANEL' });
    } catch {
      // Ensure content panel is injected programmatically
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content_panel.js'],
        });
      } catch {}
      await chrome.tabs.sendMessage(tab.id, { type: 'TB_TOGGLE_PANEL' });
    }
  });
  document.querySelector('#capture').addEventListener('click', async () => {
    const data = await captureFromPage();
    document.querySelector('#out').value = JSON.stringify(data, null, 2);
  });
  document.querySelector('#scrapePro').addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    const ok = await ensureInjected(tab.id);
    let data = {};
    if (ok) {
      // Get hints from MAIN world
      let rp = null,
        dc = null;
      try {
        const [{ result: hints } = {}] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: 'MAIN',
          func: () => ({
            rp: window.runParams || window.__run_params__ || null,
            dc: window._d_c_ && window._d_c_.DCData ? window._d_c_.DCData : null,
          }),
        });
        rp = hints?.rp || null;
        dc = hints?.dc || null;
      } catch {}
      const [{ result } = {}] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (rp, dc) =>
          window.TB_SCRAPER && window.TB_SCRAPER.scrapeWithHints
            ? window.TB_SCRAPER.scrapeWithHints(rp, dc)
            : (() => {
                const title =
                  document.querySelector('meta[property="og:title"]')?.content ||
                  document.title ||
                  document.querySelector('h1')?.textContent?.trim() ||
                  '';
                const description =
                  document.querySelector('meta[name="description"]')?.content ||
                  document.querySelector('meta[property="og:description"]')?.content ||
                  '';
                const images = Array.from(document.querySelectorAll('meta[property="og:image"]'))
                  .map((m) => m.content)
                  .filter(Boolean);
                return { title, description, images, url: location.href, host: location.host };
              })(),
        args: [rp, dc],
      });
      data = result || {};
    }
    document.querySelector('#out').value = JSON.stringify(data, null, 2);
  });
  document.querySelector('#save').addEventListener('click', async () => {
    const text = document.querySelector('#out').value || '{}';
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
    const res = await chrome.runtime.sendMessage({ type: 'TB_SAVE_RECORD', payload });
    updateCount();
    refreshList();
  });
  document.querySelector('#catScrape').addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    const ensured = await ensureInjected(tab.id);
    const lim = Number(document.querySelector('#limit')?.value) || 30;
    const [{ result: links } = {}] = ensured
      ? await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: async (lim) => {
            const normalize = (u) => {
              try {
                const m =
                  u.match(/\/item\/(\d+)\.html/i) ||
                  u.match(/\/i\/(\d+)\.html/i) ||
                  u.match(/[?&]itemId=(\d+)/i);
                if (m) return `https://www.aliexpress.com/item/${m[1]}.html`;
                const url = new URL(u, location.href);
                return url.href;
              } catch {
                return u;
              }
            };
            const seen = new Set();
            const out = [];
            const anchors = Array.from(document.querySelectorAll('a[href*="/item/"]'));
            for (const a of anchors) {
              const href = a.getAttribute('href') || '';
              if (!/\/item\//.test(href)) continue;
              const norm = normalize(href);
              if (!seen.has(norm)) {
                seen.add(norm);
                out.push(norm);
              }
              if (out.length >= lim) break;
            }
            return out;
          },
          args: [lim],
        })
      : [{}];
    if (Array.isArray(links) && links.length)
      await chrome.runtime.sendMessage({ type: 'TB_SCRAPE_URLS', urls: links, limit: lim });
  });
  document.querySelector('#cancel')?.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'TB_SCRAPE_CANCEL' });
  });
  document.querySelector('#exportAll')?.addEventListener('click', async () => {
    const data = await chrome.storage.local.get({ records: [] });
    const blob = new Blob([JSON.stringify(data.records || [], null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    chrome.downloads.download({ url, filename: `thunderbit-export-${stamp}.json`, saveAs: true });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  });
  document.querySelector('#clearAll')?.addEventListener('click', async () => {
    await chrome.storage.local.set({ records: [] });
    updateCount();
    refreshList();
  });
  chrome.runtime.onMessage.addListener((msg) => {
    const status = document.querySelector('#status');
    if (!status) return;
    if (msg?.type === 'TB_SCRAPE_PROGRESS') {
      status.textContent = `Scrape ${msg.index}/${msg.total}`;
      status.style.color = '#333';
    }
    if (msg?.type === 'TB_SCRAPE_DONE') {
      status.textContent = msg.canceled ? 'Cancelado' : `Completado (${msg.count})`;
      status.style.color = '#666';
      updateCount();
      refreshList();
    }
  });

  // Enviar JSON del textarea
  document.querySelector('#sendJson')?.addEventListener('click', async () => {
    const status = document.querySelector('#status');
    try {
      const text = document.querySelector('#out').value || '[]';
      let items = [];
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) items = parsed;
      else if (parsed && typeof parsed === 'object') items = [parsed];
      if (!items.length) throw new Error('JSON vacío');
      status.textContent = 'Enviando...';
      status.style.color = '#333';
      const r = await sendToSupabase(items);
      status.textContent = `Importados: ${r?.results?.filter((x) => x.ok && !x.skipped).length || 0}`;
      updateCount();
      const { tb_settings } = await chrome.storage.local.get({ tb_settings: {} });
      if (tb_settings?.autoRemove) {
        await removeImportedFromStorage(r?.results || []);
        refreshList();
      }
    } catch (e) {
      status.textContent = `Error: ${String(e.message || e)}`;
      status.style.color = '#b00';
    }
  });

  // Enviar registros almacenados
  document.querySelector('#sendRecords')?.addEventListener('click', async () => {
    const status = document.querySelector('#status');
    try {
      const data = await chrome.storage.local.get({ records: [] });
      const items = Array.isArray(data.records) ? data.records : [];
      if (!items.length) throw new Error('No hay registros');
      status.textContent = 'Enviando registros...';
      status.style.color = '#333';
      const r = await sendToSupabase(items);
      status.textContent = `Importados: ${r?.results?.filter((x) => x.ok && !x.skipped).length || 0}`;
      const { tb_settings } = await chrome.storage.local.get({ tb_settings: {} });
      if (tb_settings?.autoRemove) {
        await removeImportedFromStorage(r?.results || []);
        refreshList();
      }
    } catch (e) {
      status.textContent = `Error: ${String(e.message || e)}`;
      status.style.color = '#b00';
    }
  });
});
