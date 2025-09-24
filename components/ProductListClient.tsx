"use client";
import ProductCard from "./ProductCard";
import { sampleProducts } from "../lib/products";

export default function ProductListClient({ products = [] }: { products?: any[] }) {
  const list = products.length > 0 ? products : sampleProducts;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {list.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
