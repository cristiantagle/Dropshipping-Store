'use client';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border">
      <div className="grid md:grid-cols-2 gap-6 p-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Ofertas que enamoran ✨</h1>
          <p className="text-gray-600 mb-6">
            Envíos a todo Chile, pagos seguros y 10 días de garantía. Descubre tendencias para tu hogar, belleza y tecnología.
          </p>
          <a href="/categorias" className="inline-block px-5 py-2 rounded-lg bg-black text-white hover:opacity-90 transition">
            Ver categorías
          </a>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200&auto=format&fit=crop"
            alt="Destacados de la tienda"
            className="w-full h-64 md:h-80 object-cover rounded-xl shadow"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
