'use client';

import ProductCard from '@/components/ProductCard';
import type { Producto } from '@/lib/products';

type Props = { items: Producto[] };

export default function ProductListClient({ items }: Props) {
  const handleAdd = (p: Producto) => {
    try {
      localStorage.setItem('lunaria_cart_last_added', JSON.stringify({ id: p.id, ts: Date.now() }));
      alert('Producto agregado al carro');
    } catch {}
  };

  if (!items?.length) {
    return <div className="text-sm text-gray-600">No hay productos para esta categoría por ahora.</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} onAdd={() => handleAdd(p)} />
      ))}
    </div>
  );
}
