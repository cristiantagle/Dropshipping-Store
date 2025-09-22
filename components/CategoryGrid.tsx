"use client";
import React from "react";
import Link from "next/link";

const CATS = [
  { slug: "hogar", nombre: "Hogar" },
  { slug: "belleza", nombre: "Belleza" },
  { slug: "tecnologia", nombre: "Tecnología" },
  { slug: "eco", nombre: "Eco" },
  { slug: "mascotas", nombre: "Mascotas" },
  { slug: "bienestar", nombre: "Bienestar" },
];

const IMAGES: Record<string, string> = {
  hogar: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  belleza: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  tecnologia: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  eco: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
  mascotas: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  bienestar: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop",
};

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {CATS.map((c) => (
        <Link key={c.slug} href={`/categorias/${c.slug}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-md float">
            <img
              src={IMAGES[c.slug]}
              alt={c.nombre}
              className="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-full shadow-lg text-sm">
                {c.nombre}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
