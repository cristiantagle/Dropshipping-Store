export default function NotFound() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">No encontramos esa página</h1>
      <p className="text-gray-600 mb-8">Puede que el enlace esté roto o que la página haya sido movida.</p>
      <a href="/" className="inline-block rounded-xl px-5 py-2.5 bg-[#2ECC71] text-white hover:opacity-90 transition">
        Ir al inicio
      </a>
    </main>
  );
}
