/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" }
    ],
    domains: ["images.unsplash.com", "plus.unsplash.com", "source.unsplash.com"]
  }
};
export default nextConfig;
