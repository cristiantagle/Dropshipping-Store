/** @type {import('next').NextConfig} */
const isPreview = process.env.VERCEL_ENV === 'preview';

const nextConfig = {
  images: {
    unoptimized: isPreview, // en preview forzamos <img> o _next/image sin optimizar
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
export default nextConfig;
