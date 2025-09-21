"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border shadow-md">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20 text-center">
        <p className="text-xs md:text-sm uppercase tracking-widest text-emerald-700/90 font-semibold">
          Bienvenido a Lunaria
        </p>

        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
          Inspira tu día a día con productos que realmente importan
        </h1>

        <p className="mt-5 text-gray-700 md:text-lg max-w-2xl mx-auto">
          Encuentra calidad, estilo y utilidad sin complicaciones.
          Explora por categorías y descubre tus próximos favoritos.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/categorias"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition"
          >
            Explorar categorías
          </Link>
          <Link
            href="/categorias/hogar"
            className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-gray-900 hover:bg-gray-50 transition"
          >
            Ver lo nuevo
          </Link>
        </div>
      </div>
    </section>
  );
}
