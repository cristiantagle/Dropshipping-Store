export default function Hero() {
  return (
    <section className="relative w-full h-[500px]">
      <img
        src="https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/hero/hero.png"
        alt="Imagen hero de productos útiles y bonitos"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black/40 px-6">
        <h1 className="text-3xl font-bold mb-2">Descubre cosas útiles y bonitas</h1>
        <p className="mb-4">Productos prácticos, bien elegidos, con envío simple.</p>
        <div className="flex gap-4">
          <a href="/categorias" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">Explorar categorías →</a>
          <a href="/novedades" className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">Ver novedades →</a>
        </div>
      </div>
    </section>
  );
}
