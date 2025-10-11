"use client";
import Link from "next/link";
import { CATEGORY_UI } from "@/lib/categoryUi";

export default function Categorias() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {Object.entries(CATEGORY_UI)
            .filter(([slug]) => slug !== "otros")
            .map(([slug, { label, icon }]) => (
              <Link
                key={slug}
                href={`/categorias/${slug}`}
                className="flex flex-col items-center text-center group"
              >
                <span className="text-4xl mb-4">{icon}</span>
                <span className="text-lg font-medium text-gray-700">{label}</span>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
