export default function Hero() {
  return (
    <section className="relative w-full h-[500px] overflow-hidden rounded-3xl shadow-lg">
      <img
        src="https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/hero/hero.png"
        alt="Imagen hero de productos útiles y bonitos"
        className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-[2000ms] ease-out hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-4xl font-extrabold mb-3 drop-shadow-xl">
          Descubre cosas útiles y bonitas
        </h1>
        <p className="mb-6 text-lg drop-shadow">
          Productos prácticos, bien elegidos, con envío simple.
        </p>
        <div className="flex gap-4">
          <a
            href="/categorias"
            className="px-5 py-3 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            Explorar categorías →
          </a>
          <a
            href="/novedades"
            className="px-5 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-200 transition-colors"
          >
            Ver novedades →
          </a>
        </div>
      </div>
    </section>
  );
}
