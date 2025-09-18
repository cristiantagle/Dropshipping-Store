/** @type {import('next').NextConfig} */
const isPreview = process.env.VERCEL_ENV === 'preview';

const nextConfig = {
  images: {
    unoptimized: isPreview, // En preview: sin optimizador, para evitar bloqueos de CDNs
    domains: [
      'images.unsplash.com',
      'ae01.alicdn.com',
      'img.alicdn.com',
      'aliexpress-media.com',
      'g.alicdn.com'
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: 'img.alicdn.com' },
      { protocol: 'https', hostname: 'aliexpress-media.com' },
      { protocol: 'https', hostname: '*.aliexpress-media.com' },
      { protocol: 'https', hostname: 'g.alicdn.com' }
    ],
    minimumCacheTTL: 60
  }
};

// --- AUTO PATCH: Unsplash images (preview/prod parity) ---
{
  const isProd = process.env.VERCEL_ENV === "production";
  nextConfig.images = nextConfig.images || {};

  // Mantener cualquier dominio/remotePatterns previos
  const prevDomains = Array.isArray(nextConfig.images.domains) ? nextConfig.images.domains.slice() : [];
  const needDomains = ["images.unsplash.com","plus.unsplash.com","source.unsplash.com"];
  nextConfig.images.domains = Array.from(new Set([...prevDomains, ...needDomains]));

  const prevRP = Array.isArray(nextConfig.images.remotePatterns) ? nextConfig.images.remotePatterns.slice() : [];
  const needRP = [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "plus.unsplash.com" },
    { protocol: "https", hostname: "source.unsplash.com" },
  ];
  const rpKey = (r)=> (r && (r.hostname||"") + "|" + (r.protocol||""));
  const merged = new Map(prevRP.map(r=>[rpKey(r), r]));
  for (const r of needRP) if (!merged.has(rpKey(r))) merged.set(rpKey(r), r);
  nextConfig.images.remotePatterns = Array.from(merged.values());

  // Hotfix: en prod desactivar optimizer para evitar bloqueo del optimizer de Vercel
  // Preview queda con optimizer normal (mejor UX).
  if (isProd) nextConfig.images.unoptimized = true;
}

export default nextConfig;
