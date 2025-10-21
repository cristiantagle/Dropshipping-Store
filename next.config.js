/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Optimiza imágenes en producción; en desarrollo se mantiene sin optimización
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      // AliExpress/CDN (para enriquecer datos e imágenes)
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: '**.alicdn.com' },
      { protocol: 'https', hostname: 'img.alicdn.com' },
      { protocol: 'https', hostname: 'g.alicdn.com' },
      { protocol: 'https', hostname: 'aeproductimages.s3.amazonaws.com' },
      // AliExpress media CDN adicional (host detectado en TunderBit)
      { protocol: 'https', hostname: '**.aliexpress-media.com' },
    ],
  },
  
  // 🚀 Configuración para desarrollo sin cache
  ...(process.env.NODE_ENV === 'development' && {
    headers: async () => [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ],
  })
};

module.exports = nextConfig;
