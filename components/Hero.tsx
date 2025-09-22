'use client';
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-50 to-emerald-50 border p-6 sm:p-10 mb-8">
      <div className="max-w-2xl space-y-4">
        <h1 className="font-black text-3xl sm:text-4xl tracking-tight">
          Encuentra cosas útiles y bonitas para tu día a día
        </h1>
        <p className="text-neutral-600">
          Descubre categorías curadas con productos que funcionan de verdad.
        </p>
        <div className="flex gap-3">
          <Link
            href="/categorias"
            prefetch={false}
            className="inline-flex items-center justify-center rounded-xl bg-lime-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-lime-700 transition"
          >
            Explorar categorías
          </Link>
          <a
            href="#tendencias"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 font-semibold hover:bg-white/60 transition"
          >
            Ver tendencias
          </a>
        </div>
      </div>
    </section>
  );
}
