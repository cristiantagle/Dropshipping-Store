/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactivamos el optimizer siempre para evitar discrepancias entre Preview/Prod
  images: {
    unoptimized: true,
    // Mantenemos remotePatterns por si en el futuro se vuelve a activar el optimizer
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" }
    ],
    // domains adicional (compat)
    domains: ["images.unsplash.com", "plus.unsplash.com", "source.unsplash.com"]
  },
};

export default nextConfig;
