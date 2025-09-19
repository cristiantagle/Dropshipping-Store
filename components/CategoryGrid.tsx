'use client';
import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {CATEGORIAS.map(c => (
        <Link
          key={c.slug}
          href={`/categorias/${c.slug}`}
          className="group rounded-xl border p-4 hover:border-black/60 hover:bg-black/5 transition"
        >
          <div className="text-sm font-semibold">{c.nombre}</div>
          <div className="text-xs opacity-60 group-hover:opacity-80">Ver productos</div>
        </Link>
      ))}
    </div>
  );
}
