'use client';

import { Producto } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type Props = { items: Producto[] };

export default function ProductListClient({ items }: Props) {
  if (!items?.length) {
    return <p className="text-sm text-gray-500">No hay productos en esta categoría.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
