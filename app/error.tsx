'use client';
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  console.error(error);
  return (
    <html>
      <body>
        <main className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Algo salió mal</h1>
          <p className="text-gray-600 mb-8">Intenta recargar. Si persiste, vuelve más tarde.</p>
          <a href="/" className="inline-block rounded-xl px-5 py-2.5 bg-[#2ECC71] text-white hover:opacity-90 transition">
            Volver al inicio
          </a>
        </main>
      </body>
    </html>
  );
}
