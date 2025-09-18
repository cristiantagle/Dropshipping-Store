/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Toggle de emergencia: desactivar optimizador si alguna CDN falla.
    // En Vercel: NEXT_IMG_UNOPT=true
    unoptimized: process.env.NEXT_IMG_UNOPT === 'true',

    // Lista explícita (forma clásica, muy compatible)
    domains: [
      'images.unsplash.com',
      'ae01.alicdn.com',
      'img.alicdn.com',
      'aliexpress-media.com',
      'g.alicdn.com'
    ],

    // Y además remotePatterns (forma más granular)
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: 'img.alicdn.com' },
      { protocol: 'https', hostname: 'aliexpress-media.com' },
      { protocol: 'https', hostname: '*.aliexpress-media.com' },
      { protocol: 'https', hostname: 'g.alicdn.com' }
    ],

    // Opcional: cache un poco mayor
    minimumCacheTTL: 60
  }
};
export default nextConfig;
