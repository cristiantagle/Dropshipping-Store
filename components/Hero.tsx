"use client";
import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20 text-center fade-in">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Bienvenido a Lunaria</h1>
      <p className="text-lg md:text-xl mb-8">
        Encuentra productos útiles, lindos y de calidad
      </p>
      <Link
        href="/categorias"
        className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-colors"
      >
        Explorar categorías
      </Link>
    </section>
  );
}
