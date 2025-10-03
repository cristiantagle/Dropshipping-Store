import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import { supabaseServer } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = supabaseServer();

  const fetchCategory = async (slug: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, image_url, price_cents, category_slug")
      .eq("category_slug", slug)
      .not("image_url", "is", null)
      .order("price_cents", { ascending: true })
      .limit(6);

    if (error) {
      console.error("Error cargando", slug, error.message);
      return [];
    }
    return data ?? [];
  };

  const belleza = await fetchCategory("belleza");
  const bienestar = await fetchCategory("bienestar");
  const eco = await fetchCategory("eco");
  const hogar = await fetchCategory("hogar");
  const mascotas = await fetchCategory("mascotas");
  const tecnologia = await fetchCategory("tecnologia");

  return (
    <main>
      <Hero />

      <CategoryCarousel
        title="Para tu rutina de belleza"
        description="Cuida tu piel y estilo con productos ecológicos"
        products={belleza}
        link="/categorias/belleza"
      />

      <CategoryCarousel
        title="Bienestar diario"
        description="Hidratación, descanso y energía para tu día"
        products={bienestar}
        link="/categorias/bienestar"
      />

      <CategoryCarousel
        title="Hogar sustentable"
        description="Productos reutilizables que cuidan el planeta"
        products={eco}
        link="/categorias/eco"
      />

      <CategoryCarousel
        title="Ambientes que relajan"
        description="Aromas, luz y orden para tu espacio personal"
        products={hogar}
        link="/categorias/hogar"
      />

      <CategoryCarousel
        title="Para tu compañero fiel"
        description="Accesorios seguros y cómodos para tu mascota"
        products={mascotas}
        link="/categorias/mascotas"
      />

      <CategoryCarousel
        title="Tecnología útil y portátil"
        description="Gadgets que simplifican tu vida, sin complicaciones"
        products={tecnologia}
        link="/categorias/tecnologia"
      />
    </main>
  );
}
