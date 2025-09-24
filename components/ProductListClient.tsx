"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts, Product } from "../lib/products";

export default function ProductListClient({ categorySlug }: { categorySlug?: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(categorySlug).then(setProducts);
  }, [categorySlug]);

  if (products.length === 0) {
    return <p className="text-center text-gray-500">No hay productos disponibles</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
