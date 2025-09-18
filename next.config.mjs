/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Lista explícita para evitar bloqueos en <Image/>
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: 'img.alicdn.com' },
      { protocol: 'https', hostname: 'aliexpress-media.com' },
      { protocol: 'https', hostname: '*.aliexpress-media.com' }
    ]
  }
};
export default nextConfig;
