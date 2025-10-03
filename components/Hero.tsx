"use client";

import { ShoppingBag, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="lunaria-parallax relative overflow-hidden mt-16 h-[450px] flex items-center">
      {/* Overlay con degradado */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-0"></div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 text-center lg:text-left animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-xl">
          Descubre productos que{" "}
          <span className="bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent">
            inspiran
          </span>
        </h1>
        <p className="mt-4 text-lg text-white/90 drop-shadow-md max-w-xl">
          Tu tienda de confianza para belleza, hogar y más. Calidad real, precios accesibles.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <a
            href="/categorias"
            className="inline-flex items-center gap-2 bg-lime-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-lime-600 hover:scale-105 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            Explorar categorías
          </a>
          <a
            href="/ofertas"
            className="inline-flex items-center gap-2 border border-white/70 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
          >
            <Sparkles className="w-5 h-5" />
            Ver ofertas
          </a>
        </div>
      </div>
    </section>
  );
}
