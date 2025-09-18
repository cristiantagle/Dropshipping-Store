'use client';
import Image from "next/image";
import Link from "next/link";
import { categorias } from "../lib/catalogo";

export default function CategoryGrid() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Categorías destacadas</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categorias.map((c) => (
          <Link key={c.slug} href={`/categorias?c=${c.slug}`} className="group block rounded-xl overflow-hidden border">
            <div className="relative h-40 w-full">
              <Image src={c.imagen} alt={c.nombre} fill className="object-cover group-hover:scale-[1.02] transition-transform" />
            </div>
            <div className="p-3 font-medium">{c.nombre}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
