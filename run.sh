# run_fix_images.sh — resume: crea carpeta faltante y finaliza push del fix de imágenes
#!/usr/bin/env bash
set -Eeuo pipefail

REMOTE="${REPO_REMOTE:-origin}"
TS="$(date +%Y%m%d-%H%M%S)"

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }

say "🔎 Rama actual:"
git branch --show-current

# Si no estamos en una rama preview/* del fix, seguimos en la actual (ok)
# Creamos estructuras que faltaron:
say "📁 Creando directorios requeridos…"
mkdir -p app/debug/images app/api/imgcheck public

# Asegurar .vercelignore (que no suba .next)
if [[ ! -f .vercelignore ]] || ! grep -q '^\.next/?$' .vercelignore; then
  say "🧹 Asegurando .vercelignore…"
  { [[ -f .vercelignore ]] && cat .vercelignore; echo ".next"; } | awk 'NF' | sort -u > .vercelignore.tmp
  mv .vercelignore.tmp .vercelignore
fi

# next.config.mjs — parche idempotente para Unsplash (domains + remotePatterns)
say "🖼  Parcheando next.config.mjs (Unsplash)…"
if [[ -f next.config.mjs ]]; then
node - <<'NODE'
const fs=require('fs');const p='next.config.mjs';let t=fs.readFileSync(p,'utf8');
if(!/export\s+default\s+nextConfig/.test(t)){t=`/** @type {import('next').NextConfig} */\nconst nextConfig = {};\n${t}\nexport default nextConfig;\n`;}
if(!/images\.unsplash\.com|plus\.unsplash\.com|source\.unsplash\.com/.test(t)){
  t = t.replace(/export\s+default\s+nextConfig;?/,
`// --- AUTO: asegurar soporte Unsplash (paridad Preview/Prod) ---
if(!nextConfig.images) nextConfig.images = {};
nextConfig.images.loader = nextConfig.images.loader || 'default';
nextConfig.images.domains = Array.isArray(nextConfig.images.domains) ? nextConfig.images.domains : [];
for (const d of ["images.unsplash.com","plus.unsplash.com","source.unsplash.com"]) {
  if(!nextConfig.images.domains.includes(d)) nextConfig.images.domains.push(d);
}
nextConfig.images.remotePatterns = Array.isArray(nextConfig.images.remotePatterns) ? nextConfig.images.remotePatterns : [];
for (const host of ["images.unsplash.com","plus.unsplash.com","source.unsplash.com"]) {
  if(!nextConfig.images.remotePatterns.some(rp => rp && rp.hostname===host)){
    nextConfig.images.remotePatterns.push({ protocol: "https", hostname: host });
  }
}
export default nextConfig;`);
  fs.writeFileSync(p,t);
}
NODE
else
cat > next.config.mjs <<'EOF_NEXT'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'default',
    domains: ["images.unsplash.com","plus.unsplash.com","source.unsplash.com"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" }
    ]
  }
};
export default nextConfig;
EOF_NEXT
fi

# Página de debug: /debug/images
cat > app/debug/images/page.tsx <<'TS'
import Image from "next/image";

const urls = [
  "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
];

export const metadata = { title: "Debug imágenes — Lunaria" };

export default function DebugImages() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Debug imágenes (Unsplash)</h1>
      <p className="text-sm text-gray-600">Si alguna no carga, es config de imágenes y no UI.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {urls.map((u,i)=>(
          <div key={i} className="relative w-full h-48 border rounded overflow-hidden">
            <Image src={u} alt={`img-${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
TS

# API de prueba HEAD: /api/imgcheck?u=...
mkdir -p app/api/imgcheck
cat > app/api/imgcheck/route.ts <<'TS'
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u");
  if (!u) return NextResponse.json({ ok:false, error:"missing u" }, { status: 400 });
  try{
    const r = await fetch(u, { method:"HEAD" });
    return NextResponse.json({ ok:r.ok, status:r.status, url:u });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e), url:u }, { status: 500 });
  }
}
TS

# Forzar recompilación real
echo "${TS}" > public/.build-stamp

say "📝 Commit & push…"
git add -A
git commit -m "fix(images): crear dir faltante, paridad Unsplash, debug /debug/images y /api/imgcheck [es-CL]" || true
git push -u "${REMOTE}" "$(git branch --show-current)"

say "✅ En Vercel, abre el preview y visita /debug/images y /api/imgcheck?u=<URL_UNSPLASH> para validar."
