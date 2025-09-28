export default function Hero() {
  return (
    <section className="hero">
      <img
        src="https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/hero/hero.png"
        alt="Imagen hero de productos útiles y bonitos"
        className="w-full h-auto object-cover"
      />
      <div className="px-6 py-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Descubre cosas útiles y bonitas</h1>
        <p className="mb-4">Productos prácticos, bien elegidos, con envío simple.</p>
        <div className="flex justify-center gap-4">
          <a href="/categorias" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Explorar categorías →</a>
          <a href="/novedades" className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">Ver novedades →</a>
        </div>
      </div>
    </section>
  );
}
