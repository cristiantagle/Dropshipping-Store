# Repository Guidelines

## Project Structure & Module Organization

- `app/` Next.js App Router (pages, layouts, error, loading). API routes under `app/api/*` (e.g., `health`, `checkout/mercadopago`, `imgcheck`).
- `components/` Reusable React components; `contexts/` React contexts; `hooks/` custom hooks.
- `lib/` client/server utilities (Supabase clients, formatting, metadata); `lib/supabase/*` for client/server setup.
- `public/` static assets and icons; `styles/` global and module CSS; `docs/` internal docs; `scripts/` maintenance, import, and diagnostics.
- Path alias: import with `@/` from repo root (see `tsconfig.json`).

## Build, Test, and Development Commands

- `npm run dev` Start local dev server at http://localhost:3000.
- `npm run build` Type-check and build for production.
- `npm start` Serve the production build.
- `npm run lint` Lint with Next/ESLint.
- Post-install: `node scripts/inject-env.mjs` writes derived env vars when available.
- Ad hoc checks in `scripts/`:
  - TypeScript: `npx ts-node scripts/test_prices.ts`
  - ESM: `node scripts/review_categories.mjs`
  - Python: `python scripts/test_enrichment.py`

## Coding Style & Naming Conventions

- TypeScript strict mode, 2-space indentation, semicolons consistent with ESLint (Next config). Run `npm run lint` before commits.
- React components in `PascalCase` (`ProductCard.tsx`), hooks start with `use*` (`useCartListener.tsx`), contexts end with `Context.tsx`.
- Prefer module co-location; keep shared logic in `lib/`. Use `"use client"` only where needed.
- Use `@/` alias for absolute imports; keep imports ordered and deduplicated.
- Tailwind CSS is enabled; prefer utility-first styles in JSX over ad-hoc CSS.

## Testing Guidelines

- No central test runner yet. Place quick checks under `scripts/` and name them `test_*.ts|.py`.
- Minimum bar for PRs: `npm run lint` passes and `npm run build` succeeds (type errors fail the build).
- For UI changes, include manual test steps and screenshots.

## Commit & Pull Request Guidelines

- Use Conventional Commits where possible: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `ui:`, `restore:`.
- Commit messages should be concise and scoped (e.g., `fix(product-card): correct price formatting`).
- PRs must include: purpose/summary, linked issues, screenshots for visual changes, test plan (commands run), and notes on env/config impacts.

## Security & Configuration Tips

- Use `.env.local` for secrets. Keys under `NEXT_PUBLIC_*` are exposed to clients. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Payments: `MP_ACCESS_TOKEN` and `NEXT_PUBLIC_URL` are required by `app/api/checkout/mercadopago/route.ts`.
- Remote images must be allowed in `next.config.js` (`images.remotePatterns`). Add new hosts there.

## Acuerdo de Trabajo (Agente)

- Nunca tocar `main` sin tu aprobación explícita.
- Siempre crear snapshot en `.backup_global/<timestamp>` antes de cambiar algo.
- No pisar código estable: cambios reversibles y legados a `archive/`.
- Validar con `npm run build` antes de entregarte; luego pido: “prueba en local con `npm run dev`”.
- Mantener este AGENTS.md como fuente de verdad operativa; WARP.md se actualizará cuando normalicemos su codificación.

## Estado y Registro (2025-10-14)

- Snapshot: `.backup_global/20251014_103731` (respaldo completo sin `.git`, `.next`, `node_modules`).
- Carrito legado archivado: `archive/legacy_cart/CartContext.tsx`, `archive/legacy_cart/ShoppingCart.tsx` y excluido en `tsconfig.json`.
- Imágenes: `next.config.js` optimiza solo en producción; dev queda `unoptimized`.
- ESLint relajado para no bloquear build (warnings por `<img>` y deps de hooks).
- `components/ProductCard.tsx` migra a `next/image` (con `unoptimized`).

## Próximas Tareas (iterativas y con snapshot)

- Migrar `next/image` en: `components/ProductDetail.tsx`, `components/MiniCart.tsx`, `components/CarroClient.tsx`, `components/OfertasClient.tsx` (uno por vez, con build y prueba en dev).
- Mejoras UX móvil del menú tras validar las migraciones.
- Normalizar codificación de `WARP.md` y reanudar documentación exhaustiva ahí.

## Registro adicional (2025-10-14)

- Snapshots creados: `.backup_global/20251014_110431`, `20251014_111454`, `20251014_111635`, `20251014_112125`, `20251014_112457`, `20251014_115053`, `20251014_115413`, `20251014_120057`.
- Breadcrumb restaurado en `app/producto/[id]/page.tsx` (Inicio → Categorías → {Categoría} → {Producto}).
- Detalle de producto: botón de agregar al carrito reemplazado por `AddToCartButton` (funcional y consistente).
- Checkout MP: uso de `NEXT_PUBLIC_URL` (fallback `NEXT_PUBLIC_BASE_URL`) y validación de `MP_ACCESS_TOKEN`.
- OrderSummary usa `useOptimizedCart` (evita ocultar el botón de pago por estados desincronizados).
- Migraciones a `next/image` con `unoptimized`: `ProductCard`, `ProductDetail`, `ProductDetailClient`, `MiniCart`, `CarroClient`, `OfertasClient`, `app/categorias/page.tsx`.

### Registro (Auth + TopBar + Invitado) — 2025-10-14 tarde

- Usuarios: páginas `app/cuenta/login`, `app/cuenta/registro`, `app/cuenta` con `AuthProvider` (`contexts/AuthContext.tsx`) y cliente `lib/supabase/authClient.ts`.
- Perfiles: script `scripts/add_profiles.sql` (tabla `public.profiles` + RLS). Correr en SQL Editor de Supabase.
- Perfil editable: en `/cuenta` se editan `display_name` y `avatar_url` (persisten en `profiles`).
- TopBar mejorado: saludo “Hola, {nombre|email}”, avatar (o inicial), chevron con dropdown (Cuenta / Cerrar sesión) y cierre por click‑fuera.
- Invitado: checkout con email opcional en `components/CarroClient.tsx` (se envía a MP como `payer.email`).
- Política snapshots: mantenemos solo 2 últimos (limpieza aplicada); últimos: ver `.backup_global`.

### Checkout Pro (Mercado Pago) — 2025-10-14 noche

- Endpoint `app/api/checkout/mercadopago/route.ts` ajustado:
  - `sandbox_init_point` como fallback si estás en modo test.
  - `auto_return` y `notification_url` solo cuando `NEXT_PUBLIC_URL` sea `https`.
  - `back_urls` siempre definidas (dev: `http://localhost:3000/carro?...`).
- Cliente `components/CarroClient.tsx`:
  - Manejo de errores: muestra toast y log con `details` del servidor.
  - Redirección a `init_point` o `sandbox_init_point` según respuesta.
- Configuración mínima dev:
  - `.env.local`: `MP_ACCESS_TOKEN=APP_USR-...` (Access Token del usuario vendedor; para sandbox usa un Usuario de Prueba), `NEXT_PUBLIC_URL=http://localhost:3000`. Opcional: `NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...`.
  - Reiniciar `npm run dev` tras cambios.

## Estado y Registro (2025-10-15)

- Checkout: migrado a Mercado Pago Bricks (Wallet) embebido en el carrito.
- Sidebar de pago fija (sticky) en desktop; sin superposición con la lista.
- Preferencia MP endurecida para sandbox: `binary_mode: true`, `statement_descriptor: "LUNARIA"`, `payment_methods` con 1 cuota y exclusión de ticket/atm/transfer.
- Script `scripts/inject-env.mjs` ahora es merge-safe (no sobreescribe `.env.local`, solo actualiza derivadas).
- Ruta de debug eliminada: `app/debug/images/page.tsx`.

### UX Móvil (menú)

- Menú móvil con overlay (click fuera cierra), bloqueo de scroll del body y cierre con Escape.
- Cierre automático al cambiar de ruta; buscador visible en el panel móvil.
- Implementación en: `components/TopBar.tsx`.

### Configuración dev (Mercado Pago)

- Variables en `.env.local`:
  - `MP_ACCESS_TOKEN=APP_USR-...` (Access Token del vendedor. Para sandbox usa un Usuario de Prueba Vendedor).
  - `NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...` (Public Key para inicializar Bricks en el cliente).
  - `NEXT_PUBLIC_URL=http://localhost:3000`
- Notas:
  - En local (http), antes el cliente forzaba redirección a `sandbox_init_point`; con Bricks ya no se usa redirect.
  - Para pruebas, usar Comprador de Prueba distinto del Vendedor; habilitar cookies de terceros si el challenge 3DS lo requiere.

### Producción/Preview (entorno)

- Requeridas en el proveedor (ej. Vercel):
  - `NEXT_PUBLIC_URL=https://<tu-dominio>`
  - `NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...`
  - `MP_ACCESS_TOKEN=APP_USR-...`
  - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Nunca exponer: `SUPABASE_SERVICE_ROLE_KEY` (server-only).

### Fallback de Checkout

- Si falta `NEXT_PUBLIC_MP_PUBLIC_KEY`, el carrito oculta Bricks y vuelve al flujo por redirección (`init_point`).
- Implementación en: `components/CarroClient.tsx`.

### Archivos relevantes

- API: `app/api/checkout/mercadopago/route.ts` (preference con `binary_mode`, `statement_descriptor`, `payment_methods`).
- Cliente: `components/MPWallet.tsx` (Bricks Wallet), `components/CarroClient.tsx` (columna derecha sticky), `components/OrderSummary.tsx` (sin sticky interno).
- Entorno: `scripts/inject-env.mjs` (merge-safe para `.env.local`).

### Próximas Tareas (post‑Bricks)

- UX móvil del menú y navegación.
- Protección de rutas con Supabase Auth.
- Documentación en `WARP.md` (normalizar codificación) y reflejar Bricks.

## Próximas Tareas (actualizado)

- UX móvil del menú y navegación.
- Sistema de usuarios (Supabase Auth): login/registro/cerrar sesión, página de cuenta, protección de rutas.
- Normalizar codificación de `WARP.md` y retomar documentación ahí.
- Opcional: Magic Link/OAuth, mostrar nombre/avatares en más vistas.

## Estado y Registro (2025-10-16)

- UX móvil (menú y overflow):
  - Eliminado scroll lateral en móvil (overflow-x hidden global y clamping en TopBar y menú móvil).
  - ProductCard ajustado para grilla (quitado min-width que cortaba 2ª tarjeta en mobile).
  - Menú móvil: cierre automático en scroll/resize/orientación y animación simétrica (slide-in/slide-out + overlay fade in/out).
  - Z-index corregidos (dropdown usuario/MiniCart sobre el contenido en desktop).
- Hero: padding seguro y min-height en móviles; fondo migrado a next/image con fill + priority (LCP más estable).
- Accesibilidad:
  - Focus trap y ARIA básicos en menú móvil; roles/ARIA en dropdown usuario y MiniCart.
  - aria-label del botón móvil con unicode escapes (men\u00FA) para evitar mojibake.
- Tipografías: integrado next/font (Inter/Poppins) vía variables CSS en layout (sin cambios visuales).
- Codificación (mojibake):
  - Head con meta charset UTF‑8 y Content-Language (es).
  - Etiquetas acentuadas críticas en TopBar renderizadas con secuencias unicode (e.g., Categor\u00EDas, Cerrar sesi\u00F3n) para máxima robustez.
- Build: validado `npm run build` tras cada cambio.

### PRs/Branches

- Merge en main: `feat/mobile-menu-ux` y `fix/i18n-encoding` (fast‑forward).
- Limpieza de ramas remotas tras merge.
- `feat/a11y-perf-bundle`: cambios integrados en main; PR/branch cerrados.

## Recuperación de Sesión (Codex)

- Código fuente: rama `main` (todo lo de hoy ya está mergeado).
- Dependencias: `npm ci` (o `npm install`).
- Entorno (dev): crea/ajusta `.env.local` con
  - `MP_ACCESS_TOKEN=APP_USR-...` (Access Token del vendedor; usa uno de Usuario de Prueba para sandbox)
  - `NEXT_PUBLIC_URL=http://localhost:3000`
  - (Supabase) `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` ya están en `.env`.
- Perfiles: ejecutar una vez `scripts/add_profiles.sql` en el SQL Editor de Supabase para crear `public.profiles` + RLS.
- Ejecución: `npm run dev` (local) y `npm run build` (validación previa a PR/merge).
- Verificaciones rápidas:
  - Usuarios: `/cuenta/registro`, `/cuenta/login`, `/cuenta` (editar perfil).
  - TopBar: “Hola, {nombre|email}”, avatar y menú (Cuenta/Cerrar sesión).
  - Carrito: agregar ítems, contador y mini‑cart; checkout sandbox funciona en `/carro` (redirige a Mercado Pago).
- Checkout Pro (sandbox): si hay error, revisar consola del navegador → "Checkout error details".
- Backups locales: mantener máx. 2 snapshots; usar scripts de `scripts/` (o snapshot manual). `.backup_global/` está git‑ignored.
- Flujo de PRs: rama feature (e.g., `feat/<tarea>`), Commits Convencionales, abrir PR a `main`.
  codex resume 0199e2ce-fd01-71b1-9d40-54027a8d8dc1
