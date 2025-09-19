#!/usr/bin/env bash
# run.sh — preview Supabase definitivo (sin psql, sin set -e)

ts() { date +"%Y-%m-%d %H:%M:%S"; }

echo "$(ts) 🔧 Repo…"
git status >/dev/null 2>&1 || { echo "No es un repo git"; exit 1; }

BR="preview/supabase-cats-products-$(date +%Y%m%d-%H%M%S)"
echo "$(ts) 🌿 Main (ff-only)…"
git checkout main >/dev/null 2>&1 || true
git pull --ff-only >/dev/null 2>&1 || true

echo "$(ts) 🌱 Nueva rama $BR…"
git checkout -b "$BR" >/dev/null 2>&1 || true

# ---- 0) .env.local (solo si no existe) ----
if [ ! -f .env.local ]; then
  echo "$(ts) 🧪 Escribiendo .env.local (Supabase DS)…"
  cat > .env.local <<'EOF'
# === Dropshipping Store (Supabase DS) ===
NEXT_PUBLIC_SUPABASE_URL=https://iowpylofmfzlbvlhlqih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvd3B5bG9mbWZ6bGJ2bGhscWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDA2MTMsImV4cCI6MjA3Mzg3NjYxM30.PWVRcx2sJucJMNmXvpwbUzqKzbZPsADUB34cmv4WJ6U
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvd3B5bG9mbWZ6bGJ2bGhscWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODMwMDYxMywiZXhwIjoyMDczODc2NjEzfQ.tUdvTtCJ-XMt8VcGLzqFJvxWtF48RSttdC8kf4RHIgY
EOF
fi

# ---- 1) Dependencia supabase-js ----
echo "$(ts) 📦 Asegurando @supabase/supabase-js…"
jq --version >/dev/null 2>&1 || true
if [ -f package.json ]; then
  if ! grep -q '"@supabase/supabase-js"' package.json; then
    npm i -D @supabase/supabase-js >/dev/null 2>&1 || npm i @supabase/supabase-js >/dev/null 2>&1
  fi
else
  echo '{}' > package.json
  npm i -D @supabase/supabase-js >/dev/null 2>&1 || true
fi

# ---- 2) next.config.js: permitir Unsplash y Supabase storage; unoptimized para evitar problemas ----
echo "$(ts) 🖼  Ajustando next.config.js (images)…"
if [ ! -f next.config.js ]; then
  cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
module.exports = nextConfig;
EOF
else
  node - <<'NODE' || true
const fs=require('fs');
let s=fs.readFileSync('next.config.js','utf8');
if(!/unoptimized:\s*true/.test(s)){
  s=s.replace(/images:\s*{/, 'images: { unoptimized: true,');
}
if(!/images\.unsplash\.com/.test(s)){
  s=s.replace(/remotePatterns:\s*\[/, m=>m+"{ protocol:'https', hostname:'images.unsplash.com' },");
}
if(!/\*\.supabase\.co/.test(s)){
  s=s.replace(/remotePatterns:\s*\[/, m=>m+"{ protocol:'https', hostname:'*.supabase.co' },");
}
fs.writeFileSync('next.config.js',s);
NODE
fi

# ---- 3) Supabase clients ----
echo "$(ts) 🧩 lib/supabase/*"
mkdir -p lib/supabase

cat > lib/supabase/server.ts <<'EOF'
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function supabaseAdmin() {
  return createClient(url, service, { auth: { persistSession: false } });
}

export function supabaseAnon() {
  return createClient(url, anon, { auth: { persistSession: false } });
}
EOF

# ---- 4) Repositorio/Helpers catálogo ----
echo "$(ts) 📚 lib/catalog.*"
mkdir -p lib

cat > lib/catalog.repo.ts <<'EOF'
import { supabaseAdmin } from "./supabase/server";

export type Categoria = {
  slug: string;
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
};

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen_url?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria_slug: string;
};

export async function getCategorias(): Promise<Categoria[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("categorias").select("*").order("nombre");
  if (error) throw error;
  return data || [];
}

export async function getProductosByCategoria(slug: string, limit = 12): Promise<Producto[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("productos")
    .select("*")
    .eq("categoria_slug", slug)
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getCategoria(slug: string): Promise<Categoria | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("categorias")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
EOF

cat > lib/catalog.ts <<'EOF'
import { getCategorias, getProductosByCategoria, getCategoria } from "./catalog.repo";

export { getCategorias, getProductosByCategoria, getCategoria };
EOF

# ---- 5) Seed vía HTTP (sin psql) ----
echo "$(ts) 🌱 Seed script (scripts/seed-supabase.mjs)…"
mkdir -p scripts

cat > scripts/seed-supabase.mjs <<'EOF'
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(URL, SERVICE, { auth: { persistSession: false } });

const CATS = [
  { slug:'hogar', nombre:'Hogar', descripcion:'Cocina, orden, organización', imagen_url:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop' },
  { slug:'belleza', nombre:'Belleza', descripcion:'Maquillaje y cuidado personal', imagen_url:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop' },
  { slug:'tecnologia', nombre:'Tecnología', descripcion:'Accesorios tech y oficina', imagen_url:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' },
  { slug:'bienestar', nombre:'Bienestar', descripcion:'Fitness, descanso y salud', imagen_url:'https://images.unsplash.com/photo-1517836357463-d25dfeac8d58?q=80&w=1200&auto=format&fit=crop' },
  { slug:'eco', nombre:'Eco', descripcion:'Sustentables y reutilizables', imagen_url:'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop' },
  { slug:'mascotas', nombre:'Mascotas', descripcion:'Juguetes y accesorios', imagen_url:'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop' },
];

const IMG_BY = {
  hogar: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
  belleza: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop',
  tecnologia: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  bienestar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac8d58?q=80&w=1200&auto=format&fit=crop',
  eco: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop',
  mascotas: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop',
};

function mkProducts(slug){
  const arr=[];
  for(let i=1;i<=12;i++){
    const precio = 4990 + i*500;
    arr.push({
      id: `${slug}-${String(i).padStart(2,'0')}`,
      nombre: `${slug[0].toUpperCase()+slug.slice(1)} producto ${i}`,
      precio,
      imagen_url: IMG_BY[slug],
      envio: i%3===0 ? 'Rápido (stock local)' : (i%2===0 ? 'Importado (Premium)' : 'Importado (Estándar)'),
      destacado: i%5===0,
      categoria_slug: slug
    });
  }
  return arr;
}

async function main(){
  // Upsert categorías
  const { error: e1 } = await sb.from('categorias').upsert(CATS, { onConflict:'slug' });
  if(e1){ console.error('Error categorías:', e1); process.exit(1); }

  // Upsert productos (12 por cat)
  const all=[];
  for(const c of CATS){ all.push(...mkProducts(c.slug)); }

  // batch insert (para no exceder payloads)
  for(let i=0;i<all.length;i+=50){
    const chunk = all.slice(i,i+50);
    const { error } = await sb.from('productos').upsert(chunk, { onConflict:'id' });
    if(error){ console.error('Error productos:', error); process.exit(1); }
  }

  console.log('Seed OK: categorias + 12 productos por categoría');
}
main().catch(err=>{ console.error(err); process.exit(1); });
EOF

# ---- 6) Páginas Next que leen de Supabase ----
echo "$(ts) 🧭 Pages de categorías (SSR)…"
mkdir -p app/categorias

cat > app/categorias/page.tsx <<'EOF'
import Link from "next/link";
import { getCategorias } from "@/lib/catalog";

export const dynamic = "force-static";
export const metadata = { title: "Categorías" };

export default async function CategoriasPage() {
  const cats = await getCategorias();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map(c => (
          <li key={c.slug} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <h3 className="font-semibold">{c.nombre}</h3>
            <p className="text-sm text-gray-600">{c.descripcion}</p>
            <Link className="mt-2 inline-block px-3 py-1 rounded bg-black text-white" href={`/categorias/${c.slug}`}>
              Ver {c.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
EOF

mkdir -p app/categorias/[slug]
cat > app/categorias/[slug]/page.tsx <<'EOF'
import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { getCategoria, getProductosByCategoria } from "@/lib/catalog";

export const dynamic = "force-static";
export const metadata = { title: "Categoría" };

export async function generateStaticParams() {
  // Render estático sincrónico: build-time fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/categorias?select=slug`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" }
  });
  const data = await res.json();
  return (data || []).map((x:any)=>({ slug: x.slug }));
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const cat = await getCategoria(params.slug);
  if (!cat) return notFound();

  const lista = await getProductosByCategoria(params.slug, 12);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{cat.nombre}</h1>
        <p className="text-gray-600">{cat.descripcion}</p>
      </div>
      <ProductListClient items={lista} />
    </section>
  );
}
EOF

# ---- 7) ProductListClient consistente ----
echo "$(ts) 🧱 ProductListClient.tsx…"
mkdir -p components
cat > components/ProductListClient.tsx <<'EOF'
"use client";
import Image from "next/image";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen_url?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria_slug: string;
};

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items || items.length === 0) {
    return <p>No hay productos disponibles en esta categoría por ahora.</p>;
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(p => (
        <li key={p.id} className="border rounded-2xl p-4 flex flex-col gap-3">
          <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden rounded-xl">
            {p.imagen_url ? (
              <Image
                src={p.imagen_url}
                alt={p.nombre}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full grid place-content-center text-gray-500 text-sm">
                Sin imagen
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{p.nombre}</h3>
            <p className="text-sm text-gray-600">{p.envio || "—"}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold">${(p.precio/100).toFixed(0)}90</span>
            <button className="px-3 py-1 rounded bg-black text-white">Agregar</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
EOF

# ---- 8) Seed (HTTPS) ----
echo "$(ts) 🌱 Ejecutando seed (HTTPS)…"
node scripts/seed-supabase.mjs || true

# ---- 9) Commit & push ----
echo "$(ts) 📝 Commit & push…"
git add -A >/dev/null 2>&1 || true
git commit -m "feat: Supabase definitivo (categorías y 12 productos por categoría) + imágenes" >/dev/null 2>&1 || true
git push -u origin "$BR" >/dev/null 2>&1 || true

echo
echo "✅ Rama lista: $BR"
echo "🧪 Rutas a probar:"
echo "   /categorias"
echo "   /categorias/hogar"
echo "   /categorias/belleza"
echo "   /categorias/tecnologia"
echo "   /categorias/bienestar"
echo "   /categorias/eco"
echo "   /categorias/mascotas"
