# 🌙 Lunaria — Tienda Online

Tienda online construida con **Next.js (App Router)**, **Supabase** y la base visual **Lunaria**.
Optimizada para simplicidad, escalabilidad y despliegue automático en **Vercel**.

## 🚀 Características
- Next.js 13+ con App Router
- Supabase como backend
- Precios en CLP (fmtCLP centralizado)
- Carrito persistente (useCart) + Toast
- UI Lunaria: tokens, animaciones, accesibilidad
- SEO básico con head.tsx
- Previews automáticos en ramas preview/...

## 📂 Estructura
- app/ → páginas (home, producto, head, globals.css)
- components/ → ProductCard, ProductListClient, Hero, PreviewDebug, Toast, useCart
- lib/ → format.ts, supabase-wrapper.ts, products.ts

## 🛠️ Desarrollo local
npm install
npm run dev
npm run build

## 🌿 Flujo Lunaria
bash archivosgpt.sh
bash run.sh
Revisar preview en Vercel
Aprobar con “LUNARIA ok” → merge a main
