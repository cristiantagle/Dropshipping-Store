"use client";

import ProductCard from "./ProductCard";

interface Props {
  products: {
    id: string;
    name: string;
    name_es?: string;
    image_url: string;
    price_cents: number;
  }[];
}

export default function ProductCarousel({ products }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          id={p.id}
          name={p.name}
          name_es={p.name_es}
          image_url={p.image_url}
          price_cents={p.price_cents}
        />
      ))}
    </div>
  );
}
