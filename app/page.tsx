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

// --- Bloque auxiliar: enlaces reales a categorías (no afecta tus botones actuales) ---
export function CategoriasLinks() {
  const links = [
    { slug: 'hogar', label: 'Hogar' },
    { slug: 'belleza', label: 'Belleza' },
    { slug: 'tecnologia', label: 'Tecnología' },
    { slug: 'bienestar', label: 'Bienestar' },
    { slug: 'eco', label: 'Eco' },
    { slug: 'mascotas', label: 'Mascotas' },
  ];
  return (
    <div data-cats-links className="mt-10">
      <h2 className="text-xl font-semibold mb-2">Explorar por categoría</h2>
      <div className="flex flex-wrap gap-2">
        {links.map(l => (
          <a key={l.slug} href={`/categorias/${l.slug}`} className="px-3 py-1 border rounded-full text-sm hover:bg-gray-50">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
