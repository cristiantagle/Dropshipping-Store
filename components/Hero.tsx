"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-200 via-white to-emerald-100 border shadow-sm">
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none"
           style={{
             backgroundImage:
               "radial-gradient(circle at 20% 20%, rgba(0,0,0,.3) 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(0,0,0,.3) 1px, transparent 1px)",
             backgroundSize: "20px 20px",
           }}
      />
      <div className="relative px-6 py-12 md:px-10 md:py-16">
        <p className="text-sm uppercase tracking-widest text-emerald-700/90 font-semibold">
          Bienvenido a Lunaria
        </p>
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
          Descubre productos útiles, lindos y bien curados
        </h1>
        <p className="mt-3 text-gray-700 md:text-lg">
          Explora nuestras categorías y encuentra tus próximos favoritos.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/categorias"
            className="inline-flex items-center rounded-xl bg-emerald-600 text-white px-5 py-2.5 font-semibold hover:bg-emerald-700 transition shadow-sm"
          >
            Explorar categorías
          </Link>
          <a
            href="#categorias"
            className="inline-flex items-center rounded-xl bg-white text-emerald-700 px-5 py-2.5 font-semibold border border-emerald-200 hover:bg-emerald-50 transition"
          >
            Ver destacados
          </a>
        </div>
      </div>
    </section>
  );
}
