/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true, formats: ['image/avif', 'image/webp'] },
}
module.exports = nextConfig
