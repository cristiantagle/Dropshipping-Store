import Hero from "@/components/Hero";
import ProductListClient from "@/components/ProductListClient";
import { getAllProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <main>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Nuevos</h2>
        <ProductListClient initialProducts={products} />
      </section>
    </main>
  );
}
