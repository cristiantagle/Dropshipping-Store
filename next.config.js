/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },],
    unoptimized: true, formats: ['image/avif', 'image/webp'] },
}
module.exports = nextConfig
