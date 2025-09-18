/** @type {import('next').NextConfig} */
const UNSPLASH_HOSTS = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "source.unsplash.com"
];

/**
 * CSP segura pero permisiva para imágenes externas desde HTTPS y Unsplash.
 * Nota: incluimos https: para permitir otros CDNs si luego agregas imágenes externas.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: https://images.unsplash.com https://plus.unsplash.com https://source.unsplash.com",
  "connect-src 'self' https:",
  "font-src 'self' data:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
].join("; ");

const nextConfig = {
  reactStrictMode: true,
  // Desactivamos el optimizer para evitar cualquier diferencia Preview/Prod.
  images: {
    unoptimized: true,
    remotePatterns: UNSPLASH_HOSTS.map((h) => ({ protocol: "https", hostname: h })),
    domains: UNSPLASH_HOSTS,
  },
  async headers() {
    return [
      {
        // Aplica a todas las rutas
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }
        ],
      },
    ];
  },
};

export default nextConfig;
