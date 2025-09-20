import "server-only";
import { notFound } from "next/navigation";
import ProductListClient, { Producto } from "@/components/ProductListClient";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CATS: Record<string, { nombre: string; descripcion: string }> = {
  hogar: { nombre: "Hogar", descripcion: "Cosas prácticas para tu casa" },
  belleza: { nombre: "Belleza", descripcion: "Cuidado personal y accesorios" },
  tecnologia: { nombre: "Tecnología", descripcion: "Gadgets y accesorios tech" },
  bienestar: { nombre: "Bienestar", descripcion: "Fitness, descanso y salud" },
  eco: { nombre: "Eco", descripcion: "Productos reutilizables y sustentables" },
  mascotas: { nombre: "Mascotas", descripcion: "Accesorios y juguetes para tu mascota" },
};

export async function generateStaticParams() {
  return Object.keys(CATS).map((slug) => ({ slug }));
}

export const metadata = { title: "Categoría" };

type PageProps = { params: { slug: string } };

export default async function CategoriaPage({ params }: PageProps) {
  const slug = (params.slug || "").toLowerCase();
  const cat = CATS[slug];
  if (!cat) return notFound();

  // Supabase (lectura pública)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    // Si faltan envs, no rompemos: mostramos mensaje pero la página no explota
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{cat.nombre}</h1>
          <p className="text-gray-600">{cat.descripcion}</p>
        </div>
        <p className="text-amber-700">
          Falta configurar NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      </section>
    );
  }

  const supabase = createClient(url, anon, { auth: { persistSession: false } });

  // Traer EXACTAMENTE 12 por categoría (usa tu esquema seed: imagen_url, categoria_slug, etc.)
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,precio,imagen_url,envio,destacado,categoria_slug")
    .eq("categoria_slug", slug)
    .limit(12);

  const items: Producto[] = (data || []).map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    imagen_url: p.imagen_url,      // ProductListClient elige entre imagen/imagen_url/image_url/image
    envio: p.envio,
    destacado: p.destacado,
    categoria_slug: p.categoria_slug,
  }));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{cat.nombre}</h1>
        <p className="text-gray-600">{cat.descripcion}</p>
      </div>

      {error ? (
        <p className="text-rose-700">Error al cargar productos: {String(error.message || error)}</p>
      ) : (
        <ProductListClient items={items} />
      )}
    </section>
  );
}
