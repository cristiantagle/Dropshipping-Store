#!/usr/bin/env bash
set -euo pipefail

REMOTE=origin
TS=$(date +%Y%m%d-%H%M%S)
BR="preview/supabase-integration-$TS"

echo "🔧 Repo…"
git status >/dev/null

echo "🌿 Main (ff-only)…"
git checkout main
git pull --ff-only $REMOTE main || true

echo "🌱 Nueva rama $BR…"
git checkout -b "$BR"

mkdir -p lib/supabase app/categorias "[slug]" >/dev/null 2>&1 || true

# 1) next.config.js (images + unoptimized)
if [ ! -f next.config.js ]; then
  cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  }
};
module.exports = nextConfig;
EOF
else
  node - <<'EOF'
const fs=require('fs');
let s=fs.readFileSync('next.config.js','utf8');
if(!/unoptimized:\s*true/.test(s)){
  s=s.replace(/images:\s*{/, 'images: {\n    unoptimized: true,');
}
if(!/images\.unsplash\.com/.test(s)){
  s=s.replace(/remotePatterns:\s*\[/, m=>m.replace('[','[ { protocol: "https", hostname: "images.unsplash.com" }, '));
}
if(!/\*\.supabase\.co/.test(s)){
  s=s.replace(/remotePatterns:\s*\[/, m=>m.replace('[','[ { protocol: "https", hostname: "*.supabase.co" }, '));
}
fs.writeFileSync('next.config.js',s);
EOF
fi

# 2) supabase clients
cat > lib/supabase/client.ts <<'EOF'
"use client";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
EOF

cat > lib/supabase/server.ts <<'EOF'
import { createClient } from "@supabase/supabase-js";

export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
EOF

# 3) helpers de categorías
cat > lib/categorias.ts <<'EOF'
export type CategoriaSlug = 'hogar'|'belleza'|'tecnologia'|'bienestar'|'eco'|'mascotas';
export const CATEGORIAS: { slug: CategoriaSlug; nombre: string; descripcion?: string }[] = [
  { slug:'hogar', nombre:'Hogar' },
  { slug:'belleza', nombre:'Belleza' },
  { slug:'tecnologia', nombre:'Tecnología' },
  { slug:'bienestar', nombre:'Bienestar' },
  { slug:'eco', nombre:'Eco' },
  { slug:'mascotas', nombre:'Mascotas' },
];
export const isCategoria = (s: string): s is CategoriaSlug =>
  ['hogar','belleza','tecnologia','bienestar','eco','mascotas'].includes(s);
export const getCategoriaBySlug = (s: string) =>
  CATEGORIAS.find(c => c.slug === s);
EOF

# 4) ProductListClient simple (client component)
mkdir -p components
cat > components/ProductListClient.tsx <<'EOF'
"use client";
import Image from "next/image";

export type Producto = {
  id: string;
  name: string;
  description?: string;
  price_cents: number;
  image_url?: string;
  category_slug: string;
};

export default function ProductListClient({ items }: { items: Producto[] }) {
  if (!items?.length) return <p>Sin productos.</p>;
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(p => (
        <li key={p.id} className="border rounded-2xl p-4 space-y-3">
          <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-xl">
            {p.image_url ? (
              <Image
                src={p.image_url}
                alt={p.name}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold">${(p.price_cents/100).toLocaleString()}</span>
            <button className="px-3 py-1 rounded-lg bg-black text-white hover:opacity-90">
              Agregar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
EOF

# 5) Página de listado de categorías
mkdir -p app/categorias
cat > app/categorias/page.tsx <<'EOF'
import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";

export const dynamic = "force-static";

export default function CategoriasPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIAS.map(c => (
          <li key={c.slug} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <h3 className="font-semibold">{c.nombre}</h3>
            <Link
              className="inline-block mt-2 text-sm underline"
              href={`/categorias/${c.slug}`}
            >
              Ver {c.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
EOF

# 6) Página de categoría (SSR a Supabase, 12 items)
mkdir -p "app/categorias/[slug]"
cat > app/categorias/[slug]/page.tsx <<'EOF'
import { notFound } from "next/navigation";
import ProductListClient, { Producto } from "@/components/ProductListClient";
import { getCategoriaBySlug, isCategoria } from "@/lib/categorias";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return ['hogar','belleza','tecnologia','bienestar','eco','mascotas'].map(slug => ({ slug }));
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!isCategoria(slug)) return notFound();
  const cat = getCategoriaBySlug(slug)!;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('products')
    .select('id,name,description,price_cents,image_url,category_slug')
    .eq('category_slug', slug)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error(error);
    return notFound();
  }

  // Normaliza por si viniera null en image_url
  const lista: Producto[] = (data ?? []).map(p => ({
    id: String(p.id),
    name: p.name,
    description: p.description ?? '',
    price_cents: p.price_cents ?? 0,
    image_url: p.image_url ?? '',
    category_slug: p.category_slug
  }));

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {cat.nombre}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
EOF

# 7) Commit & push
echo "📝 Commit & push…"
git add -A
git commit -m "feat: Supabase categorías/productos (SSR, 12 por categoría) + imágenes unoptimized"
git push -u $REMOTE "$BR"

echo "✅ Rama lista: $BR"
echo "🔗 PR: https://github.com/cristiantagle/Dropshipping-Store/pull/new/$BR"
echo "🧪 Rutas a probar:"
echo "   /categorias"
echo "   /categorias/hogar"
echo "   /categorias/belleza"
echo "   /categorias/tecnologia"
echo "   /categorias/bienestar"
echo "   /categorias/eco"
echo "   /categorias/mascotas"
