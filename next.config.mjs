/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [
    { protocol: 'https', hostname: '**.unsplash.com' },
    { protocol: 'https', hostname: '**.aliexpress-media.com' },
    { protocol: 'https', hostname: '**.alicdn.com' }
  ] }
};
export default nextConfig;
