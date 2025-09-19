/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: { formats: ['image/avif', 'image/webp'] },
}
const nextConfigPatched = {
  ...(typeof nextConfig === 'object' ? nextConfig : {}),
  images: {
    ...(nextConfig?.images || {}),
    remotePatterns: [
      ...(nextConfig?.images?.remotePatterns || []),
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif','image/webp'],
  },
};
module.exports = nextConfigPatched;