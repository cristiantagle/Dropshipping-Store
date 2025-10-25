// Background service worker (MV3)
// - Scrape batch orchestration, storage and progress broadcast

chrome.runtime.onInstalled.addListener(() => {
  // Initial storage shape
  chrome.storage.local.get({ records: [] }, (data) => {
    if (!Array.isArray(data.records)) {
      chrome.storage.local.set({ records: [] });
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Simple echo/log for diagnostics
  if (msg?.type === 'TB_LOG') {
    console.log('[TB]', msg.payload);
    sendResponse({ ok: true });
    return true;
  }
  if (msg?.type === 'TB_SAVE_RECORD') {
    chrome.storage.local.get({ records: [] }, (data) => {
      const next = Array.isArray(data.records) ? data.records : [];
      next.unshift({ ...msg.payload, ts: Date.now() });
      chrome.storage.local.set({ records: next }, () => {
        sendResponse({ ok: true, count: next.length });
      });
    });
    return true; // async
  }
  if (msg?.type === 'TB_SCRAPE_CANCEL') {
    chrome.storage.local.set({ tb_cancel: true }, () => sendResponse({ ok: true }));
    return true;
  }
  if (msg?.type === 'TB_SCRAPE_URLS') {
    (async () => {
      const urls = Array.isArray(msg.urls) ? msg.urls : [];
      const limit = Math.min(Math.max(Number(msg.limit) || 30, 1), 200);
      const targetUrls = urls.slice(0, limit);
      const results = [];
      const failed = [];
      await new Promise((res) => chrome.storage.local.set({ tb_cancel: false }, res));
      const notify = (payload) => {
        if (sender?.tab?.id) {
          chrome.tabs.sendMessage(sender.tab.id, payload).catch(() => {});
        } else {
          console.log('[TB_PROGRESS]', payload);
        }
        try {
          chrome.runtime.sendMessage(payload);
        } catch {}
      };

      async function waitForComplete(tabId, timeoutMs = 30000) {
        const start = Date.now();
        return new Promise((resolve) => {
          const listener = (id, info) => {
            if (id === tabId && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              resolve(true);
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
          const t = setInterval(async () => {
            try {
              const tinfo = await chrome.tabs.get(tabId);
              if (tinfo.status === 'complete') {
                clearInterval(t);
                chrome.tabs.onUpdated.removeListener(listener);
                resolve(true);
              }
            } catch {
              /* tab might be closed */
            }
            if (Date.now() - start > timeoutMs) {
              clearInterval(t);
              chrome.tabs.onUpdated.removeListener(listener);
              resolve(false);
            }
          }, 500);
        });
      }

      async function scrapeOne(url) {
        const tab = await chrome.tabs.create({ url, active: false });
        const ok = await waitForComplete(tab.id);
        let data = null;
        if (ok) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['scrapers.js'],
            });
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
                      const images = Array.from(
                        document.querySelectorAll('meta[property="og:image"]'),
                      )
                        .map((m) => m.content)
                        .filter(Boolean);
                      return {
                        title,
                        description,
                        images,
                        url: location.href,
                        host: location.host,
                      };
                    })(),
              args: [rp, dc],
            });
            data = result || null;
          } catch (e) {
            data = { _error: String(e) };
          }
        }
        try {
          await chrome.tabs.remove(tab.id);
        } catch {}
        return data;
      }

      const concurrency = Math.min(Math.max(Number(msg.concurrency) || 3, 1), 6);
      let idx = 0;
      async function worker(queue) {
        while (queue.length) {
          const canceled = await new Promise((res) =>
            chrome.storage.local.get({ tb_cancel: false }, (d) => res(Boolean(d.tb_cancel))),
          );
          if (canceled) break;
          const url = queue.shift();
          if (!url) break;
          idx += 1;
          notify({ type: 'TB_SCRAPE_PROGRESS', index: idx, total: targetUrls.length, url });
          const data = await scrapeOne(url);
          results.push({ url, data });
          if (!data) failed.push(url);
          if (data) {
            await new Promise((res) => {
              chrome.storage.local.get({ records: [] }, (cur) => {
                const next = Array.isArray(cur.records) ? cur.records : [];
                next.unshift({ url, ...data, ts: Date.now() });
                chrome.storage.local.set({ records: next }, res);
              });
            });
          }
        }
      }
      const queue = [...targetUrls];
      await Promise.all(Array.from({ length: concurrency }, () => worker(queue)));

      const canceledFinal = await new Promise((res) =>
        chrome.storage.local.get({ tb_cancel: false }, (d) => res(Boolean(d.tb_cancel))),
      );
      await new Promise((res) => chrome.storage.local.set({ tb_last_failed: failed }, res));
      notify({
        type: 'TB_SCRAPE_DONE',
        count: results.length,
        canceled: canceledFinal,
        failedCount: failed.length,
      });
      sendResponse({ ok: true, results, canceled: canceledFinal, failed });
    })();
    return true;
  }
});
