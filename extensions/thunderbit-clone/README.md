# Lunaria Scraper � Chrome Extension (MV3)

Carpeta: extensions/thunderbit-clone/

Incluye:

- manifest.json (MV3)
- ackground.js (service worker): scraping en lote con concurrencia, progreso y almacenamiento
- scrapers.js (motor gen�rico + AliExpress, sin inline, compatible CSP)
- content_panel.js (panel lateral in-page: UI completa en el costado derecho)
- popup.html/js (acciones r�pidas, abre el panel y permite enviar a la tienda)

Permisos: storage, scripting, abs, ctiveTab, downloads, host_permissions (http/https).

Carga en Chrome (unpacked):

1. Ir a chrome://extensions.
2. Activar �Developer mode�.
3. �Load unpacked� ? seleccionar extensions/thunderbit-clone/.

Uso r�pido:

- Popup: Abrir Panel Lateral, Analizar producto, Descubrir productos (AE), Probar conexi�n, Exportar JSON.
- Panel: Analizar este producto, Descubrir (L�mite), Detener, Enviar este producto, Enviar lista completa, Enviar seleccionados, Reintentar fallidos, Exportar, Guardar en la lista.
- Config (panel/popup): API URL, X-Import-Token (opcional), Categor�a, Mapear por categoryId (AE), Auto eliminar importados, Limpiar lista.

Backend necesario:

- Endpoint POST /api/import/products (incluido en este repo) con Service Role. Opcional IMPORT_API_TOKEN y IMPORT_ALLOWED_ORIGINS.
- Endpoint GET /api/categories (incluido) para poblar el selector.

Precios:

- El scraper env�a precio en CLP. El backend aplica markup global del 40% (configurable v�a markup_percent).
