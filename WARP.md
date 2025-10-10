# WARP.md - Lunaria Dropshipping Store

*🔥 Guía EXHAUSTIVA y COMPLETA del repositorio para WARP (warp.dev) 🔥*

---

## 📋 Resumen del Proyecto

**Lunaria** es una plataforma de e-commerce de dropshipping avanzada que integra múltiples sistemas para ofrecer una experiencia completa de tienda online. El proyecto incluye integración con CJDropshipping para importación automática de productos, sistema de traducción con IA, gestión completa de categorías, y un robusto sistema de backups y operaciones.

### Stack Tecnológico COMPLETO
- **Framework**: Next.js 14 con App Router + Edge Runtime
- **Lenguaje**: TypeScript (configuración estricta) + Python (scripts de IA)
- **Estilos**: Tailwind CSS + CSS Modules + PostCSS
- **Base de Datos**: Supabase (PostgreSQL) con esquema personalizado
- **APIs de Terceros**: 
  - **CJDropshipping API 2.0** (importación de productos)
  - **Mercado Pago API** (pagos)
  - **Ollama/OpenAI** (traducción automática)
  - **Google Translate API** (fallback de traducción)
- **Hosting**: Vercel con Preview Deployments
- **UI/UX**: Framer Motion + Lucide React
- **Tipografía**: Inter (sans) + Poppins (display)
- **Middleware**: Next.js middleware personalizado
- **Caching**: Sistema de caché local para traducciones
- **Logs**: Sistema de logs estructurado

### Información DETALLADA del Proyecto
- **Nombre**: lunaria
- **Versión**: 1.0.2
- **Licencia**: MIT
- **Idioma Principal**: Español (es)
- **Audiencia**: B2C Dropshipping
- **Mercado**: Chile (CLP)
- **URL de desarrollo**: http://localhost:3000
- **Dominio de producción**: Configurado en Vercel
- **Base de datos**: Supabase PostgreSQL
- **CDN**: Supabase Storage + Unsplash
- **Moneda**: Pesos Chilenos (CLP)
- **Tipos de cambio**: USD a CLP (configurable)

---

## ⚡ Comandos Esenciales y Sistemas

### Instalación y Configuración
```bash
# Instalación limpia (recomendado)
npm ci

# Instalación normal
npm install

# Post-instalación automática (genera .env.local con variables Vercel)
npm run postinstall  # Ejecuta scripts/inject-env.mjs
```

### Desarrollo y Build
```bash
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Servidor de producción (después del build)
npm start

# Linting
npm run lint
npm run lint -- --fix  # Auto-corrección
```

### Sistema de Scripts Avanzado
```bash
# Script auxiliar con menú interactivo
bash scripts/run.sh

# Builds y servidores específicos
bash scripts/run.sh strict  # Build estricto (limpia node_modules + .next)
bash scripts/run.sh dev     # Servidor desarrollo
bash scripts/run.sh start   # Servidor producción

# Generar .env.local con metadatos de Vercel
node scripts/inject-env.mjs

# Diagnóstico completo de conexión a Supabase
node scripts/supa_diag.mjs
```

### Sistema de Importación CJ Dropshipping
```bash
# Importar productos desde CJ (configuración en cj_import/)
cd cj_import
ts-node -P tsconfig.json cj_insert.ts [limite]  # limite opcional (default: 100)

# Ejecutar con configuración específica
ts-node -P cj_import/tsconfig.json cj_import/cj_insert.ts 50

# Scripts individuales de CJ
ts-node -P cj_import/tsconfig.json cj_import/cj_fetch.ts     # Solo fetch
ts-node -P cj_import/tsconfig.json cj_import/cj_transform.ts # Solo transformación
ts-node -P cj_import/tsconfig.json cj_import/cj_test.ts      # Testing
```

### Sistema de Traducción con IA
```bash
# Traducción automática con Ollama/OpenAI
python scripts/translate_existing.py --help

# Traducciones con parámetros personalizados
python scripts/translate_existing.py --batch-size 5 --max-loops 20 --dry-run
python scripts/translate_existing.py --only name,desc --model llama3:8b
python scripts/translate_existing.py --temperature 0.1 --timeout 60

# Solo traducir campos específicos
python scripts/translate_existing.py --only name      # Solo nombres
python scripts/translate_existing.py --only desc      # Solo descripciones
python scripts/translate_existing.py --only short,long # Descripciones cortas y largas
```

### Gestión Avanzada de Backups
```bash
# Crear snapshot de seguridad completo
bash scripts/backup.sh

# Restauración completa desde snapshot
cp -r .backup_global/<timestamp>/* .
# O usar script dedicado:
bash scripts/restore_global.sh <timestamp>

# Backup específico de archivos
bash scripts/restore.sh

# Limpieza de archivos temporales
bash scripts/clean.sh

# Snapshot cleaner (limpia backups antiguos)
bash scripts/snapshot_cleaner.sh
```

### Herramientas de Desarrollo y Debug
```bash
# Generar bundle para GPT/IA (divide en partes)
bash archivosgpt.sh  # Genera gpt_bundle_part_*.txt

# Scripts de volcado y extracción
bash scripts/dump.sh [directorio]     # Volcar información
bash scripts/extract.sh               # Extraer datos
bash scripts/patch.sh                 # Aplicar parches
bash scripts/rollback.sh              # Rollback de cambios

# Auditoría de categorías
ts-node scripts/audit_categories.ts

# Poblado masivo de productos
bash scripts/populate_products.sh
bash "scripts/run poblado de productos.sh"
```

---

## 🔐 Variables de Entorno COMPLETAS

### Archivos de Configuración
- **`.env`**: Variables principales (contiene tokens reales)
- **`.env.local`**: Variables generadas automáticamente por scripts/inject-env.mjs
- **`.env.vercel`**: Variables específicas de Vercel
- **`cj_import/.env`**: Variables específicas para importación CJ
- **`cj_import/.env.example`**: Ejemplo de configuración CJ

### Variables COMPLETAS Sistema Principal

### Variables Públicas (Cliente)
```bash
# Supabase Públicas
NEXT_PUBLIC_SUPABASE_URL=https://iowpylofmfzlbvlhlqih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...

# URL base de la aplicación
NEXT_PUBLIC_URL=http://localhost:3000  # Desarrollo
NEXT_PUBLIC_URL=https://tu-dominio.vercel.app  # Producción

# Variables Vercel (generadas automáticamente por scripts/inject-env.mjs)
NEXT_PUBLIC_VERCEL_ENV=preview|development|production
NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF=main|develop|feature-branch
NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA=commit-hash
```

### Variables Privadas (Servidor)
```bash
# Supabase Servidor (NUNCA exponer al cliente)
SUPABASE_SERVICE_ROLE_KEY=ey...  # Service role key

# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-...      # Token de acceso Mercado Pago

# CJ Dropshipping (para importación de productos)
CJ_EMAIL=tu-email@domain.com
CJ_API_KEY=tu-api-key
CJ_ACCESS_TOKEN=API@CJ[ID]@CJ:jwt-token-completo

# IA y Traducción
OPENAI_API_KEY=sk-proj-...       # OpenAI para traducción
OLLAMA_MODEL=llama3:8b           # Modelo Ollama (opcional)
OLLAMA_URL=http://localhost:11434/api/generate  # URL Ollama

# Configuración de tipos de cambio
USD_TO_CLP=950                   # Conversión USD a Pesos Chilenos
```

### Variables Específicas CJ Import (cj_import/.env)
```bash
CJ_ACCESS_TOKEN=API@CJ[ID]@CJ:jwt-token
NEXT_PUBLIC_SUPABASE_URL=https://iowpylofmfzlbvlhlqih.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ey...
USD_TO_CLP=950
```

### Ejemplo PowerShell
```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."
$env:SUPABASE_SERVICE_ROLE_KEY="ey..."
$env:MP_ACCESS_TOKEN="APP_USR-..."
$env:NEXT_PUBLIC_URL="http://localhost:3000"
```

---

## 🚪 Sistema CJ Dropshipping Import

### Arquitectura del Sistema CJ

El proyecto incluye un sistema completo de importación automática de productos desde **CJDropshipping API 2.0**. Este sistema está ubicado en la carpeta `cj_import/` y opera de forma independiente del proyecto principal.

### Estructura del Sistema CJ
```
cj_import/
├── package.json           # Dependencias independientes
├── tsconfig.json          # Configuración TypeScript propia
├── .env                   # Variables para CJ (no versionado)
├── .env.example           # Ejemplo de configuración
├── cj_config.ts           # Sistema de categorías y mapeo
├── cj_fetch.ts            # Obtención de productos de CJ
├── cj_transform.ts        # Transformación de datos
├── cj_insert.ts           # Inserción en Supabase
├── cj_auth.ts             # Autenticación CJ
├── cj_test.ts             # Testing del sistema
├── cj_validate.ts         # Validaciones
├── cj_cleanup.ts          # Limpieza de datos
├── cj_report.ts           # Reportes y estadísticas
├── cj_dashboard.ts        # Dashboard de importaciones
└── cj_debug.ts            # Debugging
```

### Flujo de Importación CJ

1. **Fetch** (`cj_fetch.ts`): Obtiene productos de CJ API 2.0 con paginación
2. **Transform** (`cj_transform.ts`): Convierte datos CJ al esquema Supabase
3. **Categorize** (`cj_config.ts`): Aplica categorización inteligente
4. **Insert** (`cj_insert.ts`): Inserta en base de datos evitando duplicados

### Sistema de Categorización Inteligente

El archivo `cj_config.ts` contiene un sistema avanzado de categorización:

```typescript
// Categorías finales soportadas
hogar, belleza, bienestar, eco, mascotas, tecnologia, 
ropa_hombre, ropa_mujer, accesorios, otros

// Más de 200+ palabras clave por categoría
// Clasifica automáticamente por nombre de producto
// Fallback a "otros" si no encuentra categoría
```

### Configuración CJ TypeScript

```json
// cj_import/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": false,
    "allowImportingTsExtensions": true
  }
}
```

### Ejecución del Sistema CJ

```bash
# Navegar al directorio CJ
cd cj_import

# Instalar dependencias CJ
npm install

# Ejecutar importación completa
ts-node -P tsconfig.json cj_insert.ts 100  # 100 productos

# Ejecutar componentes individuales
ts-node -P tsconfig.json cj_fetch.ts      # Solo obtener datos
ts-node -P tsconfig.json cj_test.ts       # Testing
ts-node -P tsconfig.json cj_validate.ts   # Validaciones
```

---

## 🧠 Sistema de Traducción con IA

### Script de Traducción Avanzado

El archivo `scripts/translate_existing.py` es un sistema completo de traducción automática que utiliza **Ollama** y **OpenAI** para generar contenido en español.

### Capacidades del Sistema de Traducción

- **Traducción masiva**: Procesa productos existentes en lotes
- **Caché inteligente**: Evita retraducciones con sistema de hash
- **Múltiples modelos**: Soporta Ollama (local) y OpenAI (API)
- **Generación de contenido**: Crea descripciones largas y cortas
- **Categorías contextuales**: Adapta el estilo según categoría
- **Modo dry-run**: Preview sin modificar base de datos

### Campos que Traduce/Genera

1. **name_es**: Traducción del nombre del producto
2. **description_es**: Traducción de la descripción
3. **short_desc_es**: Descripción corta (máx 70 caracteres)
4. **long_desc_es**: Descripción larga (120-150 palabras)

### Estilos por Categoría

```python
# El sistema adapta el tono según la categoría:
"hogar": "Resalta decoración, calidez, orden y ambiente acogedor"
"belleza": "Resalta elegancia, glamour y cuidado personal consciente"
"bienestar": "Resalta relajación, salud y energía positiva"
"eco": "Resalta sostenibilidad y materiales reutilizables"
```

### Parámetros Avanzados del Traductor

```bash
# Control de procesamiento
--batch-size 10       # Productos por lote
--max-loops 50        # Máximo iteraciones
--sleep-ms 2000       # Espera entre lotes

# Control de IA
--model llama3:8b     # Modelo Ollama
--temperature 0.2     # Creatividad
--top-p 0.9          # Diversidad
--timeout 30         # Timeout por petición
--retries 3          # Reintentos

# Control de campos
--only name,desc     # Solo campos específicos
--dry-run           # Solo mostrar, no ejecutar
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
Lunaria-Dropshipping-Store/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx          # Página de inicio
│   ├── globals.css       # Estilos globales
│   ├── api/              # API Routes
│   │   ├── checkout/mercadopago/route.ts
│   │   ├── health/route.ts
│   │   └── imgcheck/route.ts
│   ├── carro/            # Carrito de compras
│   ├── producto/[id]/    # Detalle de producto
│   ├── categorias/       # Páginas de categorías
│   ├── debug/            # Herramientas de desarrollo
│   └── diag/             # Diagnósticos
├── components/           # Componentes reutilizables
├── lib/                  # Lógica de negocio y utilidades
├── scripts/              # Scripts de automatización
├── hooks/                # Custom hooks
├── public/               # Assets estáticos
├── styles/               # Estilos adicionales
├── supabase/             # Configuración de Supabase
└── cj_import/            # Scripts de importación
```

### App Router (Next.js 14)

#### Páginas Principales
- **`app/layout.tsx`**: Layout raíz con TopBar y Footer, configuración de metadatos
- **`app/page.tsx`**: Página de inicio con hero y carruseles de categorías
- **`app/producto/[id]/page.tsx`**: Detalle de producto con componente cliente
- **`app/carro/page.tsx`**: Carrito de compras (cliente)
- **`app/categorias/[slug]/page.tsx`**: Lista de productos por categoría

#### API Routes
- **`app/api/checkout/mercadopago/route.ts`**: Creación de preferencias de pago
- **`app/api/health/route.ts`**: Health check del sistema
- **`app/api/imgcheck/route.ts`**: Validación de imágenes

#### Páginas Especiales
- **`app/debug/images/page.tsx`**: Depuración de imágenes
- **`app/diag/page.tsx`**: Diagnósticos del sistema
- **`app/error.tsx`**: Manejo de errores
- **`app/not-found.tsx`**: Página 404
- **`app/global-error.tsx`**: Manejo global de errores

### Capa de Datos (lib/)

#### Supabase Integration
- **`lib/supabase/client.ts`**: Cliente Supabase para componentes cliente
- **`lib/supabase/server.ts`**: Factory para operaciones server-side
- **`lib/supabase-wrapper.ts`**: Wrapper adicional
- **`lib/supabaseServer.ts`**: Servidor Supabase legacy

#### Modelos y Servicios
- **`lib/products.ts`**: 
  ```typescript
  export type Producto = {
    id: string;
    name: string;
    description: string | null;
    price_cents: number;
    image_url: string | null;
    category_slug: string | null;
    created_at?: string;
  }
  
  // Funciones: getProductsByCategory, getProductById, getAllProducts
  ```

- **`lib/categorias.ts`**: Catálogo estático de categorías
  ```typescript
  export type Categoria = {
    slug: string;
    nombre: string;
    image_url: string;
  }
  
  // Categorías: belleza, bienestar, eco, hogar, mascotas, oficina, tecnologia
  ```

#### Utilidades
- **`lib/format.ts`**: Formateo de moneda (CLP)
- **`lib/categoryUi.ts`**: Utilidades de interfaz para categorías
- **`lib/useProductText.ts`**: Hook para textos de productos

### Componentes UI (components/)

#### Componentes de Presentación
- **`ProductCard.tsx`**: Tarjeta de producto con imagen, precio y acciones
- **`CategoryCarousel.tsx`**: Carrusel horizontal de productos
- **`CategoryGrid.tsx`**: Grid de categorías
- **`Hero.tsx`**: Sección hero de la página principal
- **`TopBar.tsx`**: Barra de navegación superior
- **`Footer.tsx`**: Pie de página
- **`SafeImage.tsx`**: Componente de imagen con fallback

#### Componentes de Lógica Cliente
- **`useCart.tsx`**: Hook de carrito con localStorage
- **`ProductDetailClient.tsx`**: Detalle de producto (lado cliente)
- **`CarroClient.tsx`**: Carrito de compras (lado cliente)
- **`FloatingCart.tsx`**: Carrito flotante
- **`ProductListClient.tsx`**: Lista de productos (lado cliente)

#### Componentes de Navegación
- **`BackButton.tsx`**: Botón de regreso
- **`BackNav.tsx`**: Navegación hacia atrás
- **`BackToTop.tsx`**: Botón volver arriba
- **`Breadcrumbs.tsx`**: Migas de pan
- **`SearchBar.tsx`**: Barra de búsqueda

#### Componentes de Desarrollo
- **`PreviewBadge.tsx`**: Badge de vista previa
- **`PreviewDebug.tsx`**: Información de debug
- **`Toast.tsx`**: Notificaciones

---

## 🪝 Custom Hooks Sistema

### Hooks Principales

#### `hooks/usePreviewEnv.ts`
```typescript
// Hook para detectar environment de preview
export function usePreviewEnv(): boolean {
  // Detecta preview por:
  // 1. API health endpoint
  // 2. Hostname con "-git-" (Vercel preview)
  // 3. Variables de entorno VERCEL_ENV
}
```

**Uso**: Mostrar badges y debug info solo en preview/development

#### `components/useCart.tsx`
```typescript
// Hook de carrito con localStorage
export function useCart() {
  // Funcionalidades:
  // - add(item): Añadir producto
  // - remove(id): Eliminar producto  
  // - clear(): Limpiar carrito
  // - items: Array de productos
  // - Persistencia en localStorage
  // - Eventos "carro:updated"
}
```

**Características**:
- Persistencia automática en `localStorage`
- Sistema de eventos para sincronización
- Manejo de cantidades automático
- Prevención de duplicados por ID

---

## ⚙️ Middleware y Edge Runtime

### Next.js Middleware (`middleware.ts`)
```typescript
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware base (actualmente pass-through)
export function middleware(_request: NextRequest) { 
  return NextResponse.next(); 
}

// Sin matchers configurados
export const config = { matcher: [] };
```

**Estado**: Middleware configurado pero sin lógica activa
**Potencial uso**: Autenticación, redirects, A/B testing

---

## 🚀 API Routes Completas

### `/api/health` (Edge Runtime)
```typescript
// Health check con información de deployment
export const runtime = "edge";

// Retorna:
// - ok: boolean
// - env: "preview" | "development" | "production"
// - branch: string (git branch)
// - commit: string (commit SHA)
// - ts: timestamp
```

**Uso**: Diagnósticos, detección de environment, monitoring

### `/api/imgcheck`
```typescript
// Validación de URLs de imágenes
// GET /api/imgcheck?u=https://example.com/image.jpg

// Retorna:
// - ok: boolean
// - status: HTTP status
// - url: URL verificada
// - error: mensaje de error (si falla)
```

**Uso**: Verificar que las imágenes de productos estén disponibles

### `/api/checkout/mercadopago`
```typescript
// Integración completa Mercado Pago
// POST /api/checkout/mercadopago

// Body:
// {
//   items: [
//     { title: string, quantity: number, price: number }
//   ]
// }

// Variables requeridas:
// - MP_ACCESS_TOKEN: Token Mercado Pago
// - NEXT_PUBLIC_URL: URL base para callbacks

// URLs de callback:
// - success: /success
// - failure: /failure  
// - pending: /pending
```

**Características**:
- Integración oficial SDK Mercado Pago
- Soporte para múltiples items
- Moneda fija CLP (Pesos Chilenos)
- Auto-return configurado
- Manejo de errores completo

---

## ⚙️ Configuraciones

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "ES2022"],
    "strict": true,
    "noEmit": true,
    "moduleResolution": "Bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "exclude": ["tests", "**/*.spec.ts", "**/*.spec.tsx"]
}
```

### Tailwind CSS (tailwind.config.ts)
```typescript
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "Inter", "ui-sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")]
}
```

### Next.js (next.config.js)
```javascript
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  }
}
```

### ESLint
- Usa `eslint-config-next` (configuración estándar de Next.js)
- Override de ESLint fijado en versión `8.57.1`
- No hay `.eslintrc` personalizado

---

## 🛠️ Scripts y Automatización

### Scripts Principales

#### `scripts/inject-env.mjs`
```javascript
// Genera .env.local con variables de Vercel
// Ejecutado automáticamente en postinstall
VERCEL_ENV, VERCEL_GIT_COMMIT_REF, VERCEL_GIT_COMMIT_SHA
```

#### `scripts/supa_diag.mjs`
```javascript
// Diagnóstico de conexión a Supabase
// Verifica: conexión, tablas, esquema de products
// Requiere: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### `scripts/run.sh`
```bash
# Script auxiliar con menú interactivo
# Modos: strict (build limpio), dev (desarrollo), start (producción)
# Uso: bash scripts/run.sh [modo]
```

### Scripts de Backup y Restauración
- **`scripts/backup.sh`**: Crear snapshot de seguridad
- **`scripts/restore.sh`**: Restaurar archivos específicos
- **`scripts/restore_global.sh`**: Restauración completa
- **`scripts/clean.sh`**: Limpieza de archivos temporales

### Scripts de Datos
- **`scripts/populate_products.sh`**: Poblar base de datos
- **`scripts/translate_existing.py`**: Traducción automática
- **`scripts/audit_categories.ts`**: Auditoría de categorías

### Scripts de Desarrollo
- **`scripts/extract.sh`**: Extracción de datos
- **`scripts/dump.sh`**: Volcado de información
- **`scripts/patch.sh`**: Aplicar parches
- **`scripts/rollback.sh`**: Rollback de cambios

---

## 📊 Base de Datos (Supabase)

### Esquema COMPLETO de Base de Datos

#### Tabla: products (Esquema Real)
```sql
CREATE TABLE products (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cj_id TEXT UNIQUE,                    -- ID original de CJ Dropshipping
  
  -- Nombres (multilingüe)
  name TEXT NOT NULL,                   -- Nombre original (inglés)
  name_es TEXT,                         -- Nombre traducido al español
  
  -- Descripciones
  description TEXT,                     -- Descripción original
  description_es TEXT,                  -- Descripción traducida
  short_desc TEXT,                      -- Descripción corta
  short_desc_es TEXT,                   -- Descripción corta en español
  long_desc TEXT,                       -- Descripción larga
  long_desc_es TEXT,                    -- Descripción larga en español
  
  -- Pricing
  price_cents INTEGER NOT NULL,        -- Precio en centavos CLP
  
  -- Imágenes
  image_url TEXT,                       -- URL principal de imagen
  
  -- Categorización
  category_slug TEXT,                   -- Categoría final (hogar, belleza, etc.)
  cj_category TEXT,                     -- Categoría original de CJ
  
  -- Metadatos de producto
  productsku TEXT,                      -- SKU del producto
  
  -- Campos legacy (compatibilidad)
  precio INTEGER,                       -- Legacy: usar price_cents
  imagen TEXT,                          -- Legacy: usar image_url  
  categoria TEXT,                       -- Legacy: usar category_slug
  envio TEXT,                          -- Información de envío
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Índices Recomendados
```sql
CREATE INDEX idx_products_category ON products(category_slug);
CREATE INDEX idx_products_cj_id ON products(cj_id);
CREATE INDEX idx_products_price ON products(price_cents);
CREATE INDEX idx_products_created ON products(created_at);
```

#### Campos por Funcionalidad

**Identificación y Referencias**:
- `id`: UUID principal
- `cj_id`: ID externo de CJDropshipping (para evitar duplicados)
- `productsku`: SKU del producto

**Contenido Multilingüe**:
- `name` / `name_es`: Nombres
- `description` / `description_es`: Descripciones
- `short_desc` / `short_desc_es`: Descripciones cortas
- `long_desc` / `long_desc_es`: Descripciones largas

**Comercio**:
- `price_cents`: Precio en centavos CLP
- `image_url`: URL de imagen principal
- `category_slug`: Categoría final normalizada

**Legacy y Compatibilidad**:
- `precio`, `imagen`, `categoria`, `envio`: Campos legacy mantenidos

### Categorías Disponibles
1. **belleza**: Productos de belleza y cuidado personal
2. **bienestar**: Productos de bienestar y salud
3. **eco**: Productos ecológicos y sustentables
4. **hogar**: Productos para el hogar
5. **mascotas**: Accesorios para mascotas
6. **oficina**: Productos de oficina
7. **tecnologia**: Gadgets y tecnología

### Conexión y Autenticación
- **Cliente**: `lib/supabase/client.ts` (operaciones públicas)
- **Servidor**: `lib/supabase/server.ts` (operaciones privadas)
- **Auth**: Persistencia de sesión deshabilitada

---

## 💳 Integración de Pagos (Mercado Pago)

### API Route: `/api/checkout/mercadopago`
```typescript
// Crea preferencias de pago
// Variables necesarias:
// - MP_ACCESS_TOKEN: Token de acceso
// - NEXT_PUBLIC_URL: URL base para callbacks

// Endpoints de callback:
// - success: ${NEXT_PUBLIC_URL}/carro?status=success
// - failure: ${NEXT_PUBLIC_URL}/carro?status=failure
// - pending: ${NEXT_PUBLIC_URL}/carro?status=pending
```

### Flujo de Pago
1. Usuario agrega productos al carrito (localStorage)
2. Hace clic en "Pagar" → POST a `/api/checkout/mercadopago`
3. Se crea preferencia en Mercado Pago
4. Usuario es redirigido a Mercado Pago
5. Después del pago, regresa a la tienda con status

---

## 🧪 Testing y Calidad

### Estado Actual
- **Sin framework de testing configurado**
- **TSConfig excluye archivos de test**: `**/*.spec.ts`, `**/*.spec.tsx`
- **Lint configurado**: ESLint + configuración de Next.js
- **Type checking estricto**: TypeScript strict mode

### Para Implementar Tests
```bash
# Opciones recomendadas:
npm install -D jest @testing-library/react @testing-library/jest-dom
# O
npm install -D vitest @vitejs/plugin-react
# O
npm install -D playwright @playwright/test
```

### Diagnósticos Disponibles
- **`/api/health`**: Health check de la aplicación
- **`/api/imgcheck`**: Validación de imágenes
- **`/diag`**: Página de diagnósticos frontend
- **`scripts/supa_diag.mjs`**: Diagnóstico de Supabase

---

## 🚀 Deployment (Vercel)

### Configuración Automática
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`
- **Node Version**: Automática (LTS)

### Variables de Entorno en Vercel
```bash
# Públicas
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_URL

# Privadas
SUPABASE_SERVICE_ROLE_KEY
MP_ACCESS_TOKEN
```

### Preview Deployments
- **Badge de preview**: `components/PreviewBadge.tsx`
- **Metadatos automáticos**: Variables VERCEL_* inyectadas
- **Debug info**: `components/PreviewDebug.tsx`

---

## 🔧 Desarrollo y Mantenimiento

### Flujo de Trabajo Recomendado

1. **Backup antes de cambios**
   ```bash
   bash scripts/backup.sh
   ```

2. **Desarrollo local**
   ```bash
   npm run dev
   ```

3. **Verificación**
   ```bash
   npm run lint
   npm run build  # Verificar que compila
   ```

4. **Testing de conexiones**
   ```bash
   node scripts/supa_diag.mjs
   ```

5. **Restauración si es necesario**
   ```bash
   cp -r .backup_global/<timestamp>/* .
   ```

### Convenciones de Código

#### TypeScript
- **Strict mode habilitado**
- **No emisión de JS** (noEmit: true)
- **Alias de paths**: `@/*` apunta a la raíz del proyecto
- **Imports sin extensión**: No usar `.ts` en imports para Next.js

#### Estilos
- **Tailwind primario**: Usar clases de utilidad
- **CSS Modules secundario**: Solo para componentes específicos
- **Responsive**: Mobile-first approach
- **Tipografía**: Inter para texto, Poppins para displays

#### Estructura de Componentes
```typescript
// Componente servidor (app/)
export default async function ServerComponent() {
  // Lógica de servidor
  return <div>...</div>;
}

// Componente cliente (components/)
"use client";
export default function ClientComponent() {
  // Lógica de cliente
  return <div>...</div>;
}
```

### Debugging y Logs

#### Páginas de Debug
- **`/debug/images`**: Verificar carga de imágenes
- **`/diag`**: Diagnósticos generales

#### Logs de Servidor
```bash
# Verificar logs de Next.js
tail -f .next/trace

# Logs de scripts
bash scripts/dump.sh logs/
```

---

## 📚 Documentación Adicional

### Archivos de Referencia
- **`OPERATIONS.md`**: Operaciones y flujos de trabajo detallados
- **`README.md`**: Documentación de Supabase CLI (no específica del proyecto)
- **`LICENSE`**: Licencia MIT
- **`prompcopi.txt`**: Prompts para IA
- **`tree_selected.txt`**: Estructura de archivos

### Archivos de Configuración de Desarrollo
- **`.gitignore`**: Exclusiones de Git
- **`.vercelignore`**: Exclusiones de Vercel
- **`middleware.ts`**: Middleware de Next.js
- **`postcss.config.js`**: Configuración de PostCSS

### Backups y Snapshots
- **`.backup_global/`**: Snapshots completos del proyecto
- **`.rescate-bak/`**: Backups de rescate
- **`backup_txt/`**: Backups en formato texto

---

## ⚠️ Notas Importantes

### Limitaciones Conocidas
- **README.md contiene documentación de Supabase CLI**, no del proyecto
- **Múltiples archivos .bak** en componentes (backups manuales)
- **Sin framework de testing configurado**
- **Imágenes sin optimizar** (images.unoptimized = true)

### Buenas Prácticas
- **Siempre hacer backup** antes de cambios significativos
- **Validar variables de entorno** con fallbacks seguros
- **Usar TypeScript estricto** para prevenir errores
- **Revisar build** antes de deploy
- **Mantener dependencias actualizadas**

### Solución de Problemas Comunes

#### Build Failures
```bash
# Limpiar y reinstalar
rm -rf node_modules .next
npm ci
npm run build
```

#### Problemas de Supabase
```bash
# Verificar conexión
node scripts/supa_diag.mjs

# Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### Problemas de Imágenes
- Verificar dominios en `next.config.js`
- Usar componente `SafeImage` para fallbacks
- Revisar en `/debug/images`

---

## 📝 Changelog y Versiones

### Versión Actual: 1.0.2
- ✅ Next.js 14 con App Router
- ✅ Integración completa de Supabase
- ✅ Sistema de pagos con Mercado Pago
- ✅ Carrito de compras con localStorage
- ✅ Responsive design con Tailwind
- ✅ Sistema de categorías dinámico
- ✅ Componentes de debugging
- ✅ Scripts de automatización
- ✅ Sistema de backups

### Próximas Mejoras Sugeridas
- [ ] Implementar framework de testing
- [ ] Optimización de imágenes
- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Analytics y métricas
- [ ] SEO mejorado
- [ ] PWA capabilities

---

---

## 📜 Reglas de Oro del Proyecto

*Basado en OPERATIONS.md y experiencia del proyecto*

### 🔥 Reglas FUNDAMENTALES

1. **BACKUP ANTES DE TODO**
   ```bash
   bash scripts/backup.sh  # SIEMPRE antes de cambios
   ```

2. **Restauración confiable en Windows**
   ```bash
   # ✅ CORRECTO (funciona en Windows)
   cp -r .backup_global/<timestamp>/* .
   
   # ❌ INCORRECTO (rsync no disponible)
   rsync -av .backup_global/<timestamp>/ .
   ```

3. **Cambios incrementales y reversibles**
   - Todo debe poder deshacerse con un solo comando
   - Mantener snapshots rotativos
   
4. **Consistencia en imports**
   - **Next.js (frontend)**: SIN `.ts` en imports
   - **Scripts (cj_import/, scripts/)**: Ejecutar con `ts-node -P <carpeta>/tsconfig.json`
   
5. **Variables de entorno SEGURAS**
   ```typescript
   // ✅ CORRECTO
   const token = (process.env.CJ_ACCESS_TOKEN ?? "").trim();
   if (!token) throw new Error("CJ_ACCESS_TOKEN no está definido");
   
   // ❌ INCORRECTO
   const token = process.env.CJ_ACCESS_TOKEN.trim(); // Puede ser undefined
   ```

6. **No modificar el repo entero**
   - Los cambios se limitan a la carpeta correspondiente
   - Usar scripts específicos para cada tarea

7. **Comunicación clara y copy-paste-ready**
   - Nada ambiguo
   - Todo debe poder pegarse y ejecutarse

### 🔄 Flujo de Trabajo Estándar

```bash
# 1. BACKUP
bash scripts/backup.sh

# 2. PATCH (correcciones puntuales)
# Hacer cambios específicos...

# 3. DUMP de verificación  
bash scripts/dump.sh <archivo>

# 4. BUILD ESTRICTO
npm run build
# Si falla → restaurar snapshot más reciente

# 5. DEV SERVER
npm run dev

# 6. RESTAURACIÓN (si es necesario)
cp -r .backup_global/<timestamp>/* .
```

### ⚠️ Problemas Conocidos y Soluciones

#### Imports con .ts
- **Problema**: Next.js no permite `.ts` en imports
- **Solución**: Normalizar imports en `cj_import/` sin `.ts`
- **Ejecución**: `ts-node -P cj_import/tsconfig.json archivo.ts`

#### Variables de entorno undefined
- **Problema**: `CJ_ACCESS_TOKEN.trim()` → "posiblemente undefined"
- **Solución**: Usar nullish coalescing `(process.env.VAR ?? "").trim()`

#### Restauración rota (rsync no disponible)
- **Problema**: `rsync` no existe en Windows/Git Bash
- **Solución**: `restore_global.sh` usa `cp -r`

#### Errores de sintaxis en run.sh
- **Problema**: emojis/paréntesis + encoding UTF-8 con BOM
- **Solución**: Simplificar `echo` y guardar como UTF-8 sin BOM

### 📈 Herramientas de Monitoring y Debug

#### Páginas de Diagnóstico
- **`/debug/images`**: Verificar carga de imágenes
- **`/diag`**: Diagnósticos generales del sistema
- **`/api/health`**: Health check de la API
- **`/api/imgcheck`**: Validación de imágenes externas

#### Scripts de Diagnóstico
```bash
# Diagnóstico Supabase completo
node scripts/supa_diag.mjs

# Auditoría de categorías
ts-node scripts/audit_categories.ts

# Recolector completo de repo
bash "scripts/recolector de todo el repo.sh"

# Generar bundle para IA
bash archivosgpt.sh
```

#### Archivos de Log y Monitoreo
- **`logs/translate.log`**: Logs de traducción
- **`.translate_cache.json`**: Caché de traducciones
- **`translate_existing.changes.json`**: Cambios de traducción

---

## 🎨 Consideraciones de Diseño y UX

### Tipografía y Estilos
- **Font primaria**: Inter (text-rendering optimizada)
- **Font display**: Poppins (para títulos y hero)
- **Responsive**: Mobile-first con Tailwind
- **Colores**: Esquema centrado en gray-50/gray-900
- **Animaciones**: Framer Motion para transiciones

### Optimizaciones
- **Imágenes**: `unoptimized: true` (compatibilidad)
- **Carga diferida**: SafeImage component con fallbacks
- **Edge Runtime**: API routes optimizadas
- **Caché**: Sistema de caché local para traducciones

### Internacionalización
- **Idioma base**: Español (`lang="es"`)
- **Contenido multilingüe**: Campos `_es` en base de datos
- **Traducción automática**: Sistema con IA integrado
- **Moneda**: Pesos Chilenos (CLP) únicamente

---

## 📊 Estado Actual y Métricas

### Versión: 1.0.2 - COMPLETA

✅ **Sistemas Implementados**:
- ✅ Next.js 14 App Router completo
- ✅ Integración Supabase con esquema extendido
- ✅ Sistema CJ Dropshipping con categorización IA
- ✅ Traducción automática con Ollama/OpenAI
- ✅ Pagos Mercado Pago completamente funcional
- ✅ Carrito localStorage con eventos
- ✅ Sistema de backups y restauración
- ✅ Scripts de automatización completos
- ✅ Middleware y Edge Runtime
- ✅ API routes con health checks
- ✅ Responsive design con Tailwind
- ✅ Preview deployments con badges
- ✅ Sistema de logs y monitoreo
- ✅ Debugging tools integrados

### 🎯 Próximas Mejoras Recomendadas
- [ ] Framework de testing (Jest/Vitest/Playwright)
- [ ] Optimización de imágenes nativa Next.js
- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración con dashboard
- [ ] Analytics y métricas (Google Analytics/Posthog)
- [ ] SEO avanzado con Open Graph
- [ ] PWA capabilities y offline support
- [ ] Integración con inventario en tiempo real
- [ ] Sistema de reviews y ratings
- [ ] Notificaciones push

### 📄 Documentación del Proyecto
- **WARP.md**: Guía completa (este documento)
- **OPERATIONS.md**: Reglas de oro y operaciones
- **README.md**: Documentación Supabase CLI (no del proyecto)
- **LICENSE**: Licencia MIT
- **prompcopi.txt**: Instrucciones para IA
- **dump_*.txt**: Volcados de información
- **tree_selected.txt**: Estructura de archivos

---

## 🚀 **SESIÓN DEL 10 DE OCTUBRE 2025 - LOGROS COMPLETADOS**

### ✅ **MEJORAS IMPLEMENTADAS HOY:**

#### 🎨 **Frontend de Categorías - REDISEÑO COMPLETO**
- **✅ 4 nuevas categorías agregadas**: ropa_hombre, ropa_mujer, accesorios, otros
- **✅ Iconos profesionales**: Migración completa a Lucide React
- **✅ Diseño consistente**: Colores diferenciados por categoría
- **✅ Animaciones elegantes**: Hover effects y transiciones suaves
- **✅ 100% responsive**: Mobile-first design optimizado

#### 🔧 **Fixes Técnicos Completados**
- **✅ Errores de compilación**: Arreglados imports con .ts en cj_import/
- **✅ Variables de entorno**: Fallback seguro para CJ_ACCESS_TOKEN
- **✅ TypeScript strict**: Todos los errores de tipos resueltos
- **✅ Build exitoso**: Compilación limpia sin warnings críticos

#### 📊 **Análisis de Datos Completado**
- **✅ 100 productos importados** desde CJ Dropshipping
- **✅ 100% traducciones completadas** (name_es, description_es, short_desc_es, long_desc_es)
- **✅ 9 categorías activas** con productos distribuidos:
  - Ropa Hombre: 54 productos (mayoría)
  - Hogar: 14 productos
  - Accesorios: 12 productos
  - Ropa Mujer: 7 productos
  - Otros: 5 productos
  - Belleza: 3 productos
  - Bienestar: 2 productos
  - Mascotas: 2 productos
  - Tecnología: 1 producto

#### 🛠️ **Workflow Optimizado**
- **✅ Backup system**: Scripts de backup funcionando
- **✅ Servidor independiente**: Dev server en ventana separada
- **✅ Autonomía completa**: Modificaciones sin fricción
- **✅ Git Bash integration**: Scripts .sh ejecutándose correctamente

---

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

### **Prioridad Alta (Próxima sesión)**

#### 1. 🚪 **Balancear Inventario de Productos**
```bash
# Importar más productos en categorías con pocos items
cd cj_import
ts-node -P tsconfig.json cj_insert.ts 100  # 100 productos adicionales

# Priorizar:
# - Tecnología (solo 1 producto)
# - Eco (0 productos - categoría vacía)
# - Bienestar (2 productos)
# - Mascotas (2 productos)
```

#### 2. 📊 **Optimizar Distribución por Categorías**
- **Meta**: 10-20 productos mínimo por categoría
- **Enfoque**: Llenar categorías vacías/pobres primero
- **Estrategia**: Usar mapeo inteligente de cj_config.ts

#### 3. 🔍 **Verificar Calidad de Traducciones**
```bash
# Script para detectar spanglish en traducciones
node scripts/analyze_translations.mjs

# Identificar y corregir traducciones pobres
python scripts/translate_existing.py --only description_es --dry-run
```

### **Prioridad Media**

#### 4. 🎨 **Optimizar Otras Páginas**
- **Página de producto individual**: Mejorar layout y UX
- **Carrito de compras**: Optimizar flujo de checkout
- **Página de categoría individual**: Filtros y ordenación

#### 5. 🚀 **Performance y SEO**
- **Optimización de imágenes**: Habilitar next/image optimization
- **Meta tags**: SEO mejorado por categoría y producto
- **Sitemap dinámico**: Generación automática

#### 6. 📱 **Mobile Experience**
- **PWA**: Service worker y offline support
- **Mobile checkout**: Optimización de flujo de pago
- **Touch gestures**: Navegación táctil mejorada

### **Prioridad Baja**

#### 7. 🧪 **Testing Framework**
```bash
# Implementar testing cuando el core esté estable
npm install -D jest @testing-library/react @testing-library/jest-dom
```

#### 8. 📈 **Analytics y Métricas**
- **Google Analytics 4**: Tracking de conversiones
- **Hotjar/LogRocket**: UX insights
- **Performance monitoring**: Web Vitals

---

## 🛠️ **COMANDOS QUICK START PARA PRÓXIMA SESIÓN**

### **Preparación de Entorno**
```bash
# 1. Abrir Git Bash en directorio del proyecto
cd "/c/Users/crist/OneDrive/Escritorio/Lunaria-Web/Dropshipping-Store"

# 2. Backup automático
bash scripts/backup.sh

# 3. Variables de entorno (PowerShell separado)
$env:NEXT_PUBLIC_SUPABASE_URL="https://iowpylofmfzlbvlhlqih.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."

# 4. Servidor dev (ventana separada)
npm run dev
```

### **Análisis Rápido**
```bash
# Ver estado actual de productos
node scripts/analyze_translations.mjs

# Diagnóstico de Supabase
node scripts/supa_diag.mjs

# Ver build status
npm run build
```

### **Importación de Productos**
```bash
# Importar productos adicionales
cd cj_import
ts-node -P tsconfig.json cj_insert.ts 50  # 50 productos más
```

---

## 📋 **NOTAS IMPORTANTES PARA CONTINUIDAD**

### **🔥 Workflow Establecido**
- **Servidor dev**: Siempre en ventana separada para no bloquear terminal
- **Git Bash**: Para ejecutar scripts .sh sin problemas
- **Backup first**: SIEMPRE backup antes de cambios
- **Autonomía total**: Modificaciones directas sin confirmaciones tediosas

### **⚠️ Problemas Conocidos Resueltos**
- **Imports .ts**: Arreglados en cj_import/ y scripts/
- **Variables undefined**: Fallback seguro implementado
- **Build errors**: Sistema limpio y funcional
- **SVG icons**: Migrados a Lucide React

### **🎯 Estado del Sistema**
- **Frontend**: ✅ Completo y optimizado
- **Backend**: ✅ Supabase configurado correctamente
- **Traducciones**: ✅ 100% completado para productos actuales
- **CJ Import**: ✅ Sistema funcionando perfectamente
- **Categorías**: ✅ 9/11 con productos, 2 necesitan contenido

---

*📝 Este documento se actualiza constantemente con cada cambio significativo al proyecto.*

*✨ Última actualización: 10 Octubre 2025 - Sesión completa de optimización frontend y análisis de datos completada*
