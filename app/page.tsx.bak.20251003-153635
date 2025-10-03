import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import { getAllProducts } from "@/lib/products";

export default async function HomePage() {
  const all = await getAllProducts();

  const normalize = (p: any) => ({
    id: p.id,
    name: p.name,
    image_url: p.image_url ?? "",
    price_cents: p.price_cents ?? 0,
  });

  const pick = (slug: string) =>
    all
      .filter((p) => p.category_slug === slug && p.image_url)
      .slice(0, 6)
      .map(normalize);

  return (
    <main>
      <Hero />

      <CategoryCarousel
        title="Para tu rutina de belleza"
        description="Cuida tu piel y estilo con productos ecológicos"
        products={pick("belleza")}
        link="/categorias/belleza"
      />

      <CategoryCarousel
        title="Bienestar diario"
        description="Hidratación, descanso y energía para tu día"
        products={pick("bienestar")}
        link="/categorias/bienestar"
      />

      <CategoryCarousel
        title="Hogar sustentable"
        description="Productos reutilizables que cuidan el planeta"
        products={pick("eco")}
        link="/categorias/eco"
      />

      <CategoryCarousel
        title="Ambientes que relajan"
        description="Aromas, luz y orden para tu espacio personal"
        products={pick("hogar")}
        link="/categorias/hogar"
      />

      <CategoryCarousel
        title="Para tu compañero fiel"
        description="Accesorios seguros y cómodos para tu mascota"
        products={pick("mascotas")}
        link="/categorias/mascotas"
      />

      <CategoryCarousel
        title="Tecnología útil y portátil"
        description="Gadgets que simplifican tu vida, sin complicaciones"
        products={pick("tecnologia")}
        link="/categorias/tecnologia"
      />
    </main>
  );
}
