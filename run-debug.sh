#!/usr/bin/env bash
set -euo pipefail

ts="$(date +%Y%m%d-%H%M%S)"
branch="preview/debug-bienestar-${ts}"

echo "🔧 Repo…"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "No es un repo git"; exit 1; }

echo "🌿 Cambiando a main (ff-only)…"
git fetch origin main --quiet
git checkout main --quiet
git pull --ff-only --quiet

echo "🌱 Nueva rama ${branch}…"
git checkout -b "${branch}" --quiet

echo "📦 Asegurando @supabase/supabase-js…"
if ! npm ls @supabase/supabase-js >/dev/null 2>&1; then
  npm i @supabase/supabase-js
fi

# Crea una página de diagnóstico: /debug/bienestar
mkdir -p app/debug/bienestar
cat > app/debug/bienestar/page.tsx <<'TSX'
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  nombre: string;
  precio: number | null;
  imagen_url: string | null;
  categoria_slug: string;
};

async function getBienestar(): Promise<Row[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, anon);
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,precio,imagen_url,categoria_slug")
    .eq("categoria_slug", "bienestar")
    .limit(3);
  if (error) throw error;
  return data ?? [];
}

export default async function DebugBienestarPage() {
  const items = await getBienestar();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug: Bienestar (3 items)</h1>
      {items.length === 0 && <p>No hay items.</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <li key={p.id} className="border rounded-xl p-4 space-y-3">
            <div className="text-sm text-gray-500">ID: {p.id}</div>
            <div className="font-semibold">{p.nombre}</div>
            <div className="text-sm">Precio: {p.precio ?? "—"}</div>

            <div className="text-xs text-gray-500">Next &lt;Image&gt; (400x300)</div>
            <div className="border rounded-md overflow-hidden">
              {p.imagen_url ? (
                <Image
                  src={p.imagen_url}
                  alt={p.nombre}
                  width={400}
                  height={300}
                  className="object-cover w-full h-auto"
                  unoptimized
                />
              ) : (
                <div className="p-6 bg-yellow-50 text-yellow-800">Sin imagen_url</div>
              )}
            </div>

            <div className="text-xs text-gray-500">HTML &lt;img&gt; (fallback)</div>
            <div className="border rounded-md overflow-hidden">
              {p.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagen_url} alt={p.nombre} width="400" height="300" />
              ) : (
                <div className="p-6 bg-yellow-50 text-yellow-800">Sin imagen_url</div>
              )}
            </div>

            <div className="text-xs break-all text-gray-600">URL: {p.imagen_url ?? "null"}</div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">
        Si &lt;img&gt; carga y &lt;Image&gt; NO, el problema es configuración de <code>next/image</code>.
        Si ninguna carga, el problema es la URL / dominio / CORS / red. Si aquí funciona pero en
        <code>/categorias/bienestar</code> no, el problema es el componente de categorías.
      </p>
    </main>
  );
}
TSX

# Revisa que next.config.js permita Unsplash y (temporalmente) unoptimized
if [ -f next.config.js ]; then
  if ! grep -q "images: {" next.config.js; then
    # Inyecta bloque mínimo de images si no existe
    cat > next.config.js <<'JS'
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
JS
  else
    # Asegura 'images.unsplash.com' y 'unoptimized: true'
    node -e "
const fs=require('fs');let s=fs.readFileSync('next.config.js','utf8');
if(!/images\.unsplash\.com/.test(s)){
  s=s.replace(/remotePatterns:\s*\[/, m=>m+\`{ protocol: 'https', hostname: 'images.unsplash.com' }, \`);
}
if(!/unoptimized:\s*true/.test(s)){
  s=s.replace(/images:\s*{/, 'images: {\\n    unoptimized: true,');
}
fs.writeFileSync('next.config.js',s);
"
  fi
fi

echo "📝 Commit & push…"
git add -A
git commit -m "chore(debug): /debug/bienestar con <Image> y <img> + images config" || true
git push -u origin "${branch}"

echo
echo "✅ Preview listo. Abre:  /debug/bienestar"
echo "   - Si <img> funciona y <Image> no: revisar next.config.js"
echo "   - Si nada funciona: revisar URL de imagen o red"
echo "   - Si aquí funciona y en /categorias/bienestar no: revisar ProductListClient / mapeo de campos"
