"use client";
import Link from "next/link";

export default function Hero() {
  const bg = "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop')";
  return (
    <section className="relative hero-clip h-[50vh] md:h-[62vh] lg:h-[66vh] bg-neutral-100">
      <div className="parallax-root h-full">
        <div className="parallax-scene">
          <div className="parallax-bg" style={{ backgroundImage: bg }} aria-hidden="true" />
          <div className="parallax-fg relative h-full hero-fade">
            <div className="relative z-10 h-full container-lunaria flex flex-col items-start justify-end pb-10 md:pb-14">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 drop-shadow-sm">
                Descubre cosas útiles y bonitas
              </h1>
              <p className="mt-2 md:mt-3 text-neutral-700 max-w-xl">
                Productos prácticos, bien elegidos, con envío simple. Explora por categoría o mira lo nuevo.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link href="/categorias" className="btn btn-primary text-sm sm:text-base">
                  Explorar categorías
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold text-neutral-800 hover:bg-white transition">
                  Ver novedades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
