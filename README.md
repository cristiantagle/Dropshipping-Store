# AndesDrop — Tienda de Dropshipping (Next.js 14 + Tailwind + TS)

Incluye:
- Catálogo (`lib/products.ts`)
- Carro (localStorage)
- Checkout **Mercado Pago** (SDK v2) → `app/api/checkout/mercadopago/route.ts`
- Diagnóstico: `/api/health`, `/ok.txt`
- Imágenes remotas: Unsplash / AliExpress / alicdn

## Variables de entorno
En Vercel o `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://tu-preview.vercel.app
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Desarrollo
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
