"use client";

import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./Skeleton";

interface Props {
  products: {
    id: string;
    name: string;
    name_es?: string;
    image_url: string;
    price_cents: number;
    category_slug?: string;
  }[];
  loading?: boolean;
  skeletonCount?: number;
}

export default function ProductCarousel({ products, loading = false, skeletonCount = 6 }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

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
          category_slug={p.category_slug}
        />
      ))}
    </div>
  );
}
