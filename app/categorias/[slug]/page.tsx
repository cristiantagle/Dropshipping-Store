import "server-only";
import { notFound } from "next/navigation";
import ProductListClient, { Producto } from "@/components/ProductListClient";
import { createClient } from "@supabase/supabase-js";

// Pequeño catálogo local para nombre/descripcion de la categoría (evitamos importar helpers que no están)
const CATS: Record<string, { nombre: string; descripcion: string }> = {
  hogar: { nombre: "Hogar", descripcion: "Cosas prácticas para tu casa" },
  belleza: { nombre: "Belleza", descripcion: "Cuidado personal y maquillaje" },
  tecnologia: { nombre: "Tecnología", descripcion: "Gadgets y accesorios" },
  bienestar: { nombre: "Bienestar", descripcion: "Fitness, descanso y salud" },
  eco: { nombre: "Eco", descripcion: "Productos reutilizables y eco" },
  mascotas: { nombre: "Mascotas", descripcion: "Para tus compañeros peludos" },
};

export const dynamic = "force-dynamic";

type PageProps = { params: { slug: string } };

export default async function CategoriaPage({ params }: PageProps) {
  const catMeta = CATS[params.slug];
  if (!catMeta) return notFound();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    console.error("Faltan vars de Supabase en el entorno");
    return notFound();
  }

  // Cliente de servidor SIN sesión
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Traemos 12 items de la categoría exacta (por slug)
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,precio,envio,imagen,imagen_url,image_url,image,categoria_slug")
    .eq("categoria_slug", params.slug)
    .order("id", { ascending: true })
    .limit(12);

  if (error) {
    console.error("Supabase productos error:", error);
  }

  // Acomodamos el tipo para ProductListClient (permite varias llaves de imagen)
  const items: Producto[] = (Array.isArray(data) ? data : []).map((p: any) => ({
    id: String(p.id ?? ""),
    nombre: String(p.nombre ?? ""),
    precio: Number(p.precio ?? 0),
    envio: p.envio ?? undefined,
    categoria_slug: p.categoria_slug ?? undefined,
    // No forzamos una sola key de imagen: el client sabe elegir entre imagen / imagen_url / image_url / image
    imagen: p.imagen ?? undefined,
    imagen_url: p.imagen_url ?? undefined,
    image_url: p.image_url ?? undefined,
    image: p.image ?? undefined,
  }));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{catMeta.nombre}</h1>
        <p className="text-gray-600">{catMeta.descripcion}</p>
      </div>
      <ProductListClient items={items} />
    </section>
  );
}
