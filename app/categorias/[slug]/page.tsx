import "server-only";
import { notFound } from "next/navigation";
import ProductListClient, { Producto } from "@/components/ProductListClient";
import { createClient } from "@supabase/supabase-js";

// catálogo local mínimo para título/desc
const CATS = [
  { slug:"hogar", nombre:"Hogar", descripcion:"Cosas prácticas para tu casa" },
  { slug:"belleza", nombre:"Belleza", descripcion:"Cuídate y luce increíble" },
  { slug:"tecnologia", nombre:"Tecnología", descripcion:"Gadgets y accesorios" },
  { slug:"bienestar", nombre:"Bienestar", descripcion:"Fitness, descanso y salud" },
  { slug:"eco", nombre:"Eco", descripcion:"Sustentable y reutilizable" },
  { slug:"mascotas", nombre:"Mascotas", descripcion:"Para peludos felices" },
];

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { slug: string } }) {
  const cat = CATS.find(c => c.slug === params.slug);
  if (!cat) return notFound();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // lee por slug, garantiza 12
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,precio,envio,categoria,categoria_slug,imagen,imagen_url,image_url,image")
    .eq("categoria_slug", params.slug)
    .order("id",{ ascending:true })
    .limit(12);

  if (error) {
    console.error("Supabase error:", error);
    return notFound();
  }

  const items = (data ?? []) as unknown as Producto[];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{cat.nombre}</h1>
        <p className="text-gray-600">{cat.descripcion}</p>
      </div>
      <ProductListClient items={items} />
    </section>
  );
}
