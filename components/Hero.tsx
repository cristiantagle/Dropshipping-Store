"use client";
import React from "react";
import Link from "next/link";

/**
 * Hero parallax animado — Nivel 9999999
 * - Imagen de fondo via CSS (::before) con background-attachment: fixed
 * - Gradiente animado que respira
 * - Mantiene CTA “Explorar categorías” con el mismo verde de tu marca
 * - Sin dependencias nuevas, sin tocar lógica de datos
 */
export default function Hero() {
  return (
    <section className="lunaria-parallax min-h-[68vh] flex items-center">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            Descubre productos útiles, lindos y listos para ti ✨
          </h1>
          <p className="mt-4 text-lg text-neutral-700 lunaria-hero-subtle">
            Seleccionamos lo mejor para tu casa, tu rutina y tus ideas. Compra fácil, entrega rápida y soporte humano.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/categorias"
              className="lunaria-cta inline-flex items-center gap-2 rounded-2xl bg-lime-600 px-5 py-3 text-white font-semibold hover:bg-lime-700 transition"
            >
              Explorar categorías
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <a
              href="#destacados"
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white/80 backdrop-blur px-5 py-3 text-neutral-800 hover:bg-white transition"
            >
              Ver destacados
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
