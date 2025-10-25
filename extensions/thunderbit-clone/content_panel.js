(() => {
  if (window.__TB_PANEL_LOADED__) return;
  window.__TB_PANEL_LOADED__ = true;

  const UI = {
    host: null,
    render() {
      const host = document.createElement('div');
      host.id = 'tb-side-panel';
      Object.assign(host.style, {
        position: 'fixed',
        top: '0',
        right: '0',
        height: '100vh',
        width: '420px',
        maxWidth: '40vw',
        zIndex: '2147483647',
        background: '#fff',
        borderLeft: '1px solid #e5e5e5',
        boxShadow: '0 0 18px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        transform: 'translateX(100%)',
        transition: 'transform 180ms ease',
      });
      host.attachShadow({ mode: 'open' });
      const root = document.createElement('div');
      root.innerHTML = `
        <style>
          * { box-sizing: border-box; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
          header { display:flex; align-items:center; gap:8px; padding:10px 12px; border-bottom:1px solid #eee; }
          h1 { font-size: 14px; margin:0; font-weight: 700; }
          main { flex:1; overflow:auto; padding: 12px; display:flex; flex-direction:column; gap:10px; }
          .row { display:flex; gap:8px; align-items:center; flex-wrap: wrap; }
          .btn { border:1px solid #ddd; background:#f9f9f9; padding:8px 10px; border-radius:8px; cursor:pointer; }
          .btn.primary { background:#111; color:#fff; border-color:#111; }
          .btn.danger { background:#b00; color:#fff; border-color:#900; }
          label.small { font-size:12px; color:#555; }
          input, select, textarea { width:100%; padding:8px; border:1px solid #ddd; border-radius:8px; }
          textarea { min-height: 120px; font-family: ui-monospace, SFMono, Menlo, monospace; }
          .list { display:grid; gap:8px; }
          .item { display:grid; grid-template-columns:56px 1fr auto; gap:8px; align-items:center; border:1px solid #eee; border-radius:8px; padding:8px; }
          .item img { width:56px; height:56px; object-fit:cover; border-radius:6px; background:#fafafa; border:1px solid #eee; }
          .item h3 { margin:0; font-size:13px; }
          .meta { font-size:12px; color:#666; display:flex; gap:6px; flex-wrap:wrap; }
          .muted { color:#666; font-size:12px; }
          footer { padding:10px 12px; border-top:1px solid #eee; display:flex; align-items:center; gap:8px; }
        </style>
        <header>
          <h1>Lunaria · Importador</h1>
          <div style="flex:1"></div>
          <button id="close" class="btn">Cerrar</button>
        </header>
        <main>
          <div class="row">
            <button id="scrapeOne" class="btn">Analizar este producto</button>
            <button id="discover" class="btn">Descubrir productos de esta página</button>
            <label class="small">Límite <input id="limit" type="number" min="1" max="200" value="30" style="width:90px"/></label>
            <button id="stop" class="btn danger">Detener</button>
          </div>
          <div class="row">
            <input id="apiUrl" placeholder="https://tu-dominio/api/import/products" />
            <button id="testApi" class="btn">Probar conexión</button>
            <span id="apiStatus" class="muted">Sin probar</span>
          </div>
          <div class="row">
            <input id="apiToken" placeholder="X-Import-Token (si aplica)" />
          </div>
          <div class="row">
            <select id="categorySelect"></select>
            <label class="small"><input id="useMap" type="checkbox" checked/> Mapear por categoryId (AE)</label>
          </div>
          <div class="row">
            <button id="sendSelected" class="btn primary">Enviar este producto a la tienda</button>
            <button id="sendAll" class="btn">Enviar lista completa</button>
            <button id="export" class="btn">Exportar a archivo</button>
          </div>
          <div class="row">
            <button id="sendChecked" class="btn">Enviar seleccionados</button>
            <button id="retryFailed" class="btn">Reintentar fallidos</button>
          </div>
          <div class="row">
            <label class="small"><input id="autoRemove" type="checkbox" checked/> Auto eliminar importados</label>
            <button id="clearAll" class="btn">Limpiar lista</button>
          </div>
          <div class="row"><span id="status" class="muted">Listo</span></div>
          <p class="muted">Resultados recientes</p>
          <div id="list" class="list"></div>
          <p class="muted">Detalle JSON</p>
          <textarea id="out" placeholder="[]"></textarea>
        </main>
        <footer>
          <button id="saveJson" class="btn">Guardar en la lista</button>
        </footer>
      `;
      host.shadowRoot.appendChild(root);
      document.documentElement.appendChild(host);
      this.host = host;
      this.toggle(true);
      Logic.init(host.shadowRoot);
    },
    toggle(v) {
      if (!this.host) return;
      this.host.style.transform = v ? 'translateX(0)' : 'translateX(100%)';
    },
  };

  const Logic = {
    root: null,
    selected: new Set(),
    async init(root) {
      this.root = root;
      root.getElementById('close').addEventListener('click', () => UI.toggle(false));
      root.getElementById('scrapeOne').addEventListener('click', async () => {
        const data = await this.scrapeCurrent();
        root.getElementById('out').value = JSON.stringify(data || {}, null, 2);
      });
      root.getElementById('discover').addEventListener('click', async () => {
        const lim = Number(root.getElementById('limit').value) || 30;
        const links = await this.collectLinks(lim);
        chrome.runtime.sendMessage({ type: 'TB_SCRAPE_URLS', urls: links, limit: lim });
      });
      root
        .getElementById('stop')
        .addEventListener('click', () => chrome.runtime.sendMessage({ type: 'TB_SCRAPE_CANCEL' }));
      root.getElementById('export').addEventListener('click', async () => {
        const data = await chrome.storage.local.get({ records: [] });
        const blob = new Blob([JSON.stringify(data.records || [], null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        chrome.downloads.download({ url, filename: `lunaria-export-${stamp}.json`, saveAs: true });
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      });
      root.getElementById('saveJson').addEventListener('click', async () => {
        const text = root.getElementById('out').value || '{}';
        let payload;
        try {
          payload = JSON.parse(text);
        } catch {
          payload = { raw: text };
        }
        await chrome.runtime.sendMessage({ type: 'TB_SAVE_RECORD', payload });
        this.refreshList();
      });
      root.getElementById('sendSelected').addEventListener('click', async () => {
        const status = root.getElementById('status');
        try {
          const text = root.getElementById('out').value || '{}';
          let items = [];
          try {
            const parsed = JSON.parse(text);
            items = Array.isArray(parsed) ? parsed : [parsed];
          } catch {}
          if (!items.length) throw new Error('No hay datos para enviar');
          status.textContent = 'Enviando...';
          const res = await this.sendToSupabase(items);
          status.textContent = `Importados: ${res?.results?.filter((x) => x.ok && !x.skipped).length || 0}`;
          const auto = this.root.getElementById('autoRemove').checked;
          if (auto) await this.removeImported(res?.results || []);
          await this.refreshList();
        } catch (e) {
          status.textContent = `Error: ${String(e.message || e)}`;
        }
      });
      root.getElementById('sendAll').addEventListener('click', async () => {
        const status = root.getElementById('status');
        try {
          const data = await chrome.storage.local.get({ records: [] });
          const items = Array.isArray(data.records) ? data.records : [];
          if (!items.length) throw new Error('No hay registros');
          status.textContent = 'Enviando lista...';
          const res = await this.sendToSupabase(items);
          status.textContent = `Importados: ${res?.results?.filter((x) => x.ok && !x.skipped).length || 0}`;
          const auto = this.root.getElementById('autoRemove').checked;
          if (auto) await this.removeImported(res?.results || []);
          await this.refreshList();
        } catch (e) {
          status.textContent = `Error: ${String(e.message || e)}`;
        }
      });
      root.getElementById('sendChecked').addEventListener('click', async () => {
        const status = root.getElementById('status');
        try {
          const items = await this.getSelectedItems();
          if (!items.length) throw new Error('No hay seleccionados');
          status.textContent = 'Enviando seleccionados...';
          const res = await this.sendToSupabase(items);
          status.textContent = `Importados: ${res?.results?.filter((x) => x.ok && !x.skipped).length || 0}`;
          const auto = this.root.getElementById('autoRemove').checked;
          if (auto) await this.removeImported(res?.results || []);
          await this.refreshList();
        } catch (e) {
          status.textContent = `Error: ${String(e.message || e)}`;
        }
      });
      root.getElementById('retryFailed').addEventListener('click', async () => {
        const status = root.getElementById('status');
        try {
          const { tb_last_failed, records } = await chrome.storage.local.get({
            tb_last_failed: [],
            records: [],
          });
          const failed = Array.isArray(tb_last_failed) ? tb_last_failed : [];
          const recs = Array.isArray(records) ? records : [];
          const items = recs.filter((r) => failed.includes(r.url));
          if (!items.length) throw new Error('No hay fallidos para reintentar');
          status.textContent = 'Reintentando fallidos...';
          const res = await this.sendToSupabase(items);
          status.textContent = `Importados: ${res?.results?.filter((x) => x.ok && !x.skipped).length || 0}`;
          const auto = this.root.getElementById('autoRemove').checked;
          if (auto) await this.removeImported(res?.results || []);
          await this.refreshList();
        } catch (e) {
          status.textContent = `Error: ${String(e.message || e)}`;
        }
      });
      // Settings load
      const { tb_settings } = await chrome.storage.local.get({ tb_settings: {} });
      if (tb_settings?.apiUrl) root.getElementById('apiUrl').value = tb_settings.apiUrl;
      if (tb_settings?.apiToken) root.getElementById('apiToken').value = tb_settings.apiToken;
      root.getElementById('useMap').checked = tb_settings?.useMap ?? true;
      await this.loadCategories();
      if (tb_settings?.defaultCategory) {
        const sel = root.getElementById('categorySelect');
        sel.value = tb_settings.defaultCategory;
      }
      // Persist changes and test
      ['apiUrl', 'apiToken', 'useMap', 'categorySelect'].forEach((id) => {
        root.getElementById(id)?.addEventListener('change', async () => {
          this.saveSettings();
          if (id === 'apiUrl') await this.testConnection();
        });
      });
      root.getElementById('testApi')?.addEventListener('click', () => this.testConnection());
      root.getElementById('clearAll')?.addEventListener('click', async () => {
        await chrome.storage.local.set({ records: [] });
        await this.refreshList();
      });

      this.refreshList();

      chrome.runtime.onMessage.addListener((msg) => {
        if (msg?.type === 'TB_SCRAPE_PROGRESS') {
          root.getElementById('status').textContent = `Procesando ${msg.index}/${msg.total}`;
        }
        if (msg?.type === 'TB_SCRAPE_DONE') {
          root.getElementById('status').textContent = msg.canceled
            ? 'Cancelado'
            : `Completado (${msg.count})`;
          this.refreshList();
        }
      });
    },
    async scrapeCurrent() {
      if (window.TB_SCRAPER?.scrape) return window.TB_SCRAPER.scrape();
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
    },
    normalizeAeUrl(u) {
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
    },
    async collectLinks(limit = 30) {
      const seen = new Set();
      const out = [];
      const collect = () => {
        const anchors = Array.from(document.querySelectorAll('a[href*="/item/"]'));
        for (const a of anchors) {
          const href = a.getAttribute('href') || '';
          if (!/\/item\//.test(href)) continue;
          const norm = this.normalizeAeUrl(href);
          if (!seen.has(norm)) {
            seen.add(norm);
            out.push(norm);
          }
          if (out.length >= limit) break;
        }
      };
      collect();
      let rounds = 0;
      while (out.length < limit && rounds < 20) {
        rounds++;
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        await new Promise((r) => setTimeout(r, 800));
        collect();
      }
      return out.slice(0, limit);
    },
    async refreshList() {
      const data = await chrome.storage.local.get({ records: [], tb_last_failed: [] });
      const list = this.root.getElementById('list');
      list.innerHTML = '';
      const items = (Array.isArray(data.records) ? data.records : []).slice(0, 50);
      const failed = new Set(Array.isArray(data.tb_last_failed) ? data.tb_last_failed : []);
      for (const r of items) {
        const el = document.createElement('div');
        el.className = 'item';
        const img = document.createElement('img');
        const firstImg = Array.isArray(r.images)
          ? r.images.find((u) => typeof u === 'string' && u)
          : '';
        img.src =
          firstImg ||
          'data:image/svg+xml;charset=utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23fafafa%22/%3E%3C/svg%3E';
        const body = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = r.title || r.url || 'Producto';
        const meta = document.createElement('div');
        meta.className = 'meta';
        const p = document.createElement('span');
        p.textContent = r.price ? `${r.price} ${r.currency || ''}` : '';
        const s = document.createElement('span');
        s.textContent = r.store ? `Tienda: ${r.store}` : '';
        if (failed.has(r.url)) {
          const f = document.createElement('span');
          f.textContent = 'Fallido';
          f.style.color = '#b00';
          meta.appendChild(f);
        }
        meta.append(p, s);
        body.append(h3, meta);
        const side = document.createElement('div');
        side.className = 'muted';
        side.textContent = r.ts ? new Date(r.ts).toLocaleString() : '';
        const chkWrap = document.createElement('div');
        chkWrap.style.display = 'flex';
        chkWrap.style.alignItems = 'center';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = this.selected.has(r.url);
        chk.addEventListener('change', () => {
          if (chk.checked) this.selected.add(r.url);
          else this.selected.delete(r.url);
        });
        chkWrap.appendChild(chk);
        el.append(img, body, side);
        el.addEventListener('click', (e) => {
          if (e.target?.tagName?.toLowerCase() !== 'input' && r.url) window.open(r.url, '_blank');
        });
        // Insert checkbox at the start
        el.insertBefore(chkWrap, img);
        // Adjust grid: add one more column for checkbox
        el.style.gridTemplateColumns = '20px 56px 1fr auto';
        list.appendChild(el);
      }
    },
    async getSelectedItems() {
      const data = await chrome.storage.local.get({ records: [] });
      const recs = Array.isArray(data.records) ? data.records : [];
      const sel = this.selected.size ? [...this.selected] : [];
      return recs.filter((r) => sel.includes(r.url));
    },
    async loadCategories() {
      const sel = this.root.getElementById('categorySelect');
      sel.innerHTML = '';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Elige categoría (opcional)';
      sel.appendChild(placeholder);
      const { tb_settings } = await chrome.storage.local.get({ tb_settings: {} });
      let origin = '';
      if (tb_settings?.apiUrl) {
        try {
          origin = new URL(tb_settings.apiUrl).origin;
        } catch {}
      }
      let items = null;
      if (origin) {
        try {
          const res = await fetch(`${origin}/api/categories`);
          const json = await res.json().catch(() => ({}));
          if (res.ok && Array.isArray(json?.items)) items = json.items;
        } catch {}
      }
      if (!items)
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
      for (const c of items) {
        const o = document.createElement('option');
        o.value = c.slug;
        o.textContent = c.nombre || c.slug;
        sel.appendChild(o);
      }
    },
    saveSettings() {
      const apiUrl = this.root.getElementById('apiUrl').value.trim();
      const apiToken = this.root.getElementById('apiToken').value.trim();
      const defaultCategory = this.root.getElementById('categorySelect').value.trim();
      const useMap = this.root.getElementById('useMap').checked;
      const autoRemove = this.root.getElementById('autoRemove').checked;
      chrome.storage.local.set({
        tb_settings: { apiUrl, apiToken, defaultCategory, useMap, autoRemove },
      });
    },
    async removeImported(results) {
      const successUrls = (Array.isArray(results) ? results : [])
        .filter((r) => r && r.ok && !r.skipped && r.url)
        .map((r) => r.url);
      if (!successUrls.length) return;
      const data = await chrome.storage.local.get({ records: [] });
      const next = (Array.isArray(data.records) ? data.records : []).filter(
        (r) => !successUrls.includes(r.url),
      );
      await chrome.storage.local.set({ records: next });
    },
    async sendToSupabase(items) {
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
    },
    async testConnection() {
      const status = this.root.getElementById('apiStatus');
      const apiUrl = this.root.getElementById('apiUrl').value.trim();
      if (!apiUrl) {
        status.textContent = 'Falta API URL';
        status.style.color = '#b00';
        return false;
      }
      let origin = '';
      try {
        origin = new URL(apiUrl).origin;
      } catch {
        status.textContent = 'URL inválida';
        status.style.color = '#b00';
        return false;
      }
      try {
        status.textContent = 'Probando...';
        status.style.color = '#333';
        const res = await fetch(`${origin}/api/categories`);
        if (res.ok) {
          status.textContent = 'Conexión OK';
          status.style.color = '#0a0';
          return true;
        }
        status.textContent = `Error ${res.status}`;
        status.style.color = '#b00';
        return false;
      } catch {
        status.textContent = 'Sin conexión';
        status.style.color = '#b00';
        return false;
      }
    },
  };

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'TB_TOGGLE_PANEL') {
      if (!UI.host) UI.render();
      else UI.toggle(true);
    }
  });
})();
