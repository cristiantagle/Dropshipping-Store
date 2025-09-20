import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic"; // asegura SSR fresh

// Normaliza strings: quita acentos y baja a minúsculas
function normalizeCat(s: string) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu,"")
    .replace(/\s+/g," ").trim();
}

export async function generateStaticParams() {
  // opcional: si no tienes una tabla categorias, predefine slugs
  return [
    { slug: "hogar" },
    { slug: "belleza" },
    { slug: "tecnologia" },
    { slug: "bienestar" },
    { slug: "eco" },
    { slug: "mascotas" },
  ];
}

export const metadata = { title: "Categoría" };

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const slug = (params.slug || "").toLowerCase();

  // Leer 12 productos por categoria_slug
  const { data, error } = await supabase
    .from('productos')
    .select('id,nombre,precio,envio,destacado,imagen_url,categoria_slug')
    .eq('categoria_slug', slug)
    .limit(12);

  if (error) {
    console.error('Supabase error:', error);
    return notFound();
  }

  const items = (data || []).map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    envio: p.envio,
    destacado: p.destacado,
    categoria_slug: p.categoria_slug,
    imagen: p.imagen_url, // <-- clave que ProductListClient leerá primero
    imagen_url: p.imagen_url,
  }));

  if (items.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{slug}</h1>
          <p className="text-gray-600">No hay productos disponibles en esta categoría por ahora.</p>
        </div>
      </section>
    );
  }

  const titulo = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{titulo}</h1>
        <p className="text-gray-600">Descubre nuestros productos de {titulo}.</p>
      </div>
      <ProductListClient items={items} />
    </section>
  );
}
