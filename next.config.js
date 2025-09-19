/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permitimos deploy sin optimizador y orígenes remotos que usamos
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Si usas buckets públicos en Supabase (storage), habilita *.supabase.co
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  // (opcional) si usas app router con TS flexible
  typescript: {
    // no forzamos build a fallar por tipos mientras estabilizamos
    // ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
