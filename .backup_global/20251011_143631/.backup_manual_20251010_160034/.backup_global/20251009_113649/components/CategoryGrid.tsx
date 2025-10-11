"use client";
import Link from "next/link";
import { CATEGORY_UI } from "@/lib/categoryUi";

export default function CategoryGrid() {
  const categorias = Object.entries(CATEGORY_UI).filter(([slug]) => slug !== "otros");

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categorias.map(([slug, { label, icon }]) => (
        <li
          key={slug}
          className="group relative overflow-hidden rounded-2xl border bg-white hover:shadow-md transition"
        >
          <Link href={`/categorias/${slug}`} className="block p-6 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="mt-3 text-lg font-semibold">{label}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
