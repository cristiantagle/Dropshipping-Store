"use client";
import { productos } from "../lib/products";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import CategoryGrid from "../components/CategoryGrid";

export default function Page() {
  const key = "carro";
  function addToCart(id: string) {
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([...current, id]));
    alert("Producto agregado al carro");
  }
  const destacados = productos.filter(p => p.destacado);
  return (
    <section className="space-y-10">
      <Hero />
      <TrustStrip />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Destacados</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destacados.map(p => <ProductCard key={p.id} p={p} onAdd={addToCart} />)}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comprar por categoría</h2>
        <CategoryGrid />
      </div>
    </section>
  );
}
