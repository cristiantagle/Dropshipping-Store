"use client";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIAS } from "@/lib/categorias";

const CAT_IMAGES: Record<string, string> = {
  hogar: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
  belleza: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
  tecnologia: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
  eco: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop",
  mascotas: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop",
  bienestar: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=800&auto=format&fit=crop",
};

export default function CategoryGrid() {
  return (
    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {CATEGORIAS.map((cat) => (
        <Link data-cat-tile 
          key={cat.slug}
          href={`/categorias/${cat.slug}`}
          className="relative group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white"
        >
          <div className="relative w-full h-48">
            <Image
              src={CAT_IMAGES[cat.slug] || "/placeholder.png"}
              alt={cat.nombre}
              fill
              className="relative object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
          <div className="relative absolute bottom-0 left-0 p-4 text-white">
            <h3 className="cat-title relative text-lg font-bold drop-shadow">{cat.nombre}</h3>
            <p className="relative text-sm opacity-90 drop-shadow">
              {cat.descripcion ?? "Explora lo mejor en esta categoría"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
