'use client';
import { useState } from "react";
import { Producto } from "@/lib/products";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

export default function ProductListClient({ initialProducts }: { initialProducts: Producto[] }) {
  const [products] = useState<Producto[]>(initialProducts || []);

  if (!products || products.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
