export default function Head() {
  // Head global (App Router) — no duplica metadata de layout.tsx
  return (
    <>
      {/* Performance hints */}
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://images.ctfassets.net" crossOrigin="" />
      <link rel="dns-prefetch" href="https://images.ctfassets.net" />

      {/* PWA / SEO */}
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="theme-color" content="#2ECC71" />
      <meta name="format-detection" content="telephone=no" />
    </>
  );
}
