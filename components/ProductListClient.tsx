"use client";

import ProductCard from "@/components/ProductCard";

export default function ProductListClient({ items }: { items: any[] }) {
  if (!items?.length) {
    return <p className="text-sm opacity-70">No hay productos en esta categoría (aún).</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p, idx) => (
        <ProductCard key={p.id ?? idx} p={p} />
      ))}
    </div>
  );
}
