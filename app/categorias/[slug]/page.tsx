import "server-only";
import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { createClient } from "@supabase/supabase-js";

// Mapa mínimo para títulos/desc
const CATS: Record<string,{nombre:string, descripcion:string}> = {
  hogar: { nombre: "Hogar", descripcion: "Cosas prácticas para tu casa" },
  belleza: { nombre: "Belleza", descripcion: "Cuidado personal y maquillaje" },
  tecnologia: { nombre: "Tecnología", descripcion: "Gadgets y accesorios" },
  bienestar: { nombre: "Bienestar", descripcion: "Fitness, descanso y salud" },
  eco: { nombre: "Eco", descripcion: "Opciones reutilizables y sustentables" },
  mascotas: { nombre: "Mascotas", descripcion: "Para tus compañeros peludos" },
};

type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria?: string | null;
  categoria_slug?: string | null;
};

export const dynamic = "force-dynamic"; // para evitar cache terco en previews

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const slug = (params?.slug || "").toLowerCase();
  const cat = CATS[slug];
  if (!cat) return notFound();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    // Falla segura (mejor que "1 item sin imagen")
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">{cat.nombre}</h1>
        <p className="text-gray-600">{cat.descripcion}</p>
        <p className="text-red-600">Faltan variables de entorno de Supabase.</p>
      </section>
    );
  }

  const supa = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await supa
    .from("productos")
    .select("*")
    .eq("categoria_slug", slug)
    .order("id", { ascending: true })
    .limit(12);

  if (error) {
    console.error("Supabase error:", error);
  }

  const items: Producto[] = Array.isArray(data) ? data : [];
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
