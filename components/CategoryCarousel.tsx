"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  image_url: string;
  price_cents: number;
}

interface Props {
  title: string;
  description: string;
  products: Product[];
  link: string;
}

export default function CategoryCarousel({ title, description, products, link }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        {/* Flechas de navegación */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          onClick={(e) => {
            const container = (e.currentTarget.parentNode as HTMLElement).querySelector("div.overflow-x-auto");
            container?.scrollBy({ left: -300, behavior: "smooth" });
          }}
        >
          ‹
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          onClick={(e) => {
            const container = (e.currentTarget.parentNode as HTMLElement).querySelector("div.overflow-x-auto");
            container?.scrollBy({ left: 300, behavior: "smooth" });
          }}
        >
          ›
        </button>
      </div>
      <div className="mt-6 text-center">
        <a
          href={link}
          className="inline-block bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
        >
          Ver todo
        </a>
      </div>
    </section>
  );
}
