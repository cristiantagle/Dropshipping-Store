# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project summary
- Tech stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Data layer: Supabase (client and server wrappers)
- Payments: Mercado Pago checkout API route
- Notable scripts: scripts/inject-env.mjs (writes .env.local with Vercel metadata), scripts/supa_diag.mjs (Supabase connectivity diagnostics)
- Note on README: The existing README.md contains Supabase CLI documentation and is not project-specific. Prefer the guidance here for this repo.

Common commands
Use npm (package-lock.json present). On Windows PowerShell (pwsh), prefix environment variables with $env:.

- Install dependencies
  - Clean install using lockfile: npm ci
  - Regular install: npm install

- Start dev server (Next.js)
  - npm run dev
  - Default dev URL: http://localhost:3000

- Build production bundle
  - npm run build

- Start production server (after build)
  - npm start

- Lint (Next + ESLint)
  - Check: npm run lint
  - Auto-fix: npm run lint -- --fix

- Regenerate .env.local with Vercel metadata (PreviewBadge)
  - node scripts/inject-env.mjs

- Supabase diagnostics (checks connection and basic schema)
  - Ensure env vars are set (see Environment) then run:
  - node scripts/supa_diag.mjs

Tests
- No test runner is configured in this repository. There are no npm scripts for test, and tsconfig.json excludes tests. If tests are added later (e.g., with Jest/Vitest/Playwright), include how to run a single test in package scripts and update this section accordingly.

Environment
These variables are used across the app and scripts. Create an .env.local at the repo root for local development. The postinstall script only writes Vercel-related preview variables; you must set Supabase and Mercado Pago variables yourself.

- Public (exposed to client)
  - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anon key
  - NEXT_PUBLIC_URL: Base site URL used in Mercado Pago back_urls (e.g., http://localhost:3000 in dev)
  - VERCEL_ENV, VERCEL_GIT_COMMIT_REF, VERCEL_GIT_COMMIT_SHA: written by scripts/inject-env.mjs if present in environment

- Server-only
  - SUPABASE_SERVICE_ROLE_KEY: Service role key for server-side Supabase operations (used by lib/supabase/server.ts). Do not expose to the client.
  - MP_ACCESS_TOKEN: Mercado Pago access token for checkout API route

- Example (PowerShell, current session only)
  - $env:NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
  - $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."
  - $env:SUPABASE_SERVICE_ROLE_KEY="ey..."
  - $env:MP_ACCESS_TOKEN="APP_USR-..."
  - $env:NEXT_PUBLIC_URL="http://localhost:3000"

Architecture overview
- Next.js App Router
  - Entry layout: app/layout.tsx (global styles in app/globals.css, Inter font, TopBar navigation, footer)
  - Home: app/page.tsx fetches multiple category product lists server-side via supabaseServer()
  - Product detail: app/producto/[id]/page.tsx fetches a single product and renders a client component
  - Cart: app/carro/page.tsx renders a client-side cart component
  - API routes:
    - app/api/checkout/mercadopago/route.ts creates a Mercado Pago preference using MP_ACCESS_TOKEN and NEXT_PUBLIC_URL back_urls
    - app/api/health/route.ts and app/api/imgcheck/route.ts are present for diagnostics/utility endpoints

- Data access and utilities (lib/)
  - lib/supabase/client.ts: "use client" Supabase client initialized with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY; auth.persistSession disabled
  - lib/supabase/server.ts: Factory supabaseServer() using SUPABASE_SERVICE_ROLE_KEY for server-side operations
  - lib/products.ts: Typed product accessors (getAllProducts, getProductsByCategory, getProductById) using the public Supabase client
  - lib/categorias.ts: Static category catalog and helpers (getAllCategories, getCategory)
  - lib/format.ts: CLP currency formatting utility

- UI components (components/)
  - Presentation: ProductCard, CategoryCarousel, CategoryGrid, Hero, Footer, TopBar, etc.
  - Client logic: useCart (localStorage-based cart with add/remove/clear and "carro:updated" events), ProductDetailClient, CarroClient, FloatingCart
  - Image handling: SafeImage; remote image domains are whitelisted via next.config.js

- Styling: Tailwind CSS
  - tailwind.config.ts limits content to ./app/**/*.{ts,tsx} and ./components/**/*.{ts,tsx}
  - postcss.config.js includes tailwindcss and autoprefixer
  - Global styles in app/globals.css

- Images and Next config
  - next.config.js sets images.unoptimized = true and allows images from images.unsplash.com and *.supabase.co via remotePatterns
  - If adding other image domains, update next.config.js accordingly

Conventions and notes
- TypeScript is strict with noEmit; moduleResolution is "Bundler"; baseUrl is "." with path alias "@/*" to the project root
- Linting uses eslint-config-next (no custom .eslintrc checked in). Use npm run lint to verify conventions
- There are multiple *.bak files in app/ and components/ retained as backups; these are not used by the app at runtime
