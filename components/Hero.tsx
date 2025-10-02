export default function Hero() {
  return (
    <section className="relative h-[500px] flex items-center justify-center text-center text-white">
      <img
        src="https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/hero/hero.png"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
      <div className="relative z-10 max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Descubre cosas útiles y bonitas
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Productos prácticos, bien elegidos, con envío simple.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/categorias"
            className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-md font-semibold"
          >
            Explorar categorías
          </a>
          <a
            href="#nuevos"
            className="bg-white text-lime-700 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold"
          >
            Ver novedades
          </a>
        </div>
      </div>
    </section>
  );
}
