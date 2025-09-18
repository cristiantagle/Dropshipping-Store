'use client';
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import CategoryGrid from "../components/CategoryGrid";
import ProductList from "../components/ProductList";

export default function HomePage() {
  return (
    <section className="space-y-10">
      <Hero />
      <TrustStrip />
      <ProductList soloDestacados titulo="Destacados" />
      <CategoryGrid />
    </section>
  );
}
