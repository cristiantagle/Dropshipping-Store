'use client';
import Link from "next/link";

export default function Hero() {
  const bg = "url('/lunaria-icon.png";
  return (
    <section className="relative hero-clip h-[50vh] md:h-[62vh] lg:h-[66vh] bg-neutral-100">
      <div className="parallax-root h-full">
        <div className="parallax-scene">
          <div
            className="parallax-bg parallax-bg-fixed"
            style={{ backgroundImage: bg }}
            aria-hidden="true"
          />
          <div className="parallax-fg relative h-full hero-fade">
            <div className="relative z-10 h-full mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-start justify-end pb-10 md:pb-14">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 drop-shadow-sm">
                Descubre cosas útiles y bonitas
              </h1>
              <p className="mt-2 md:mt-3 text-neutral-700 max-w-xl">
                Productos prácticos, bien elegidos, con envío simple. Explora por categoría o mira lo nuevo.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/categorias"
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:bg-lime-700 transition"
                >
                  Explorar categorías
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold text-neutral-800 hover:bg-white transition"
                >
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
