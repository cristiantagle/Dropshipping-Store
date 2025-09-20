import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { createServerClient } from "@/lib/supabase/server";

// Slugs válidos (para SSG)
const SLUGS = ["hogar","belleza","tecnologia","bienestar","eco","mascotas"];

export const dynamic = "force-static";

export async function generateStaticParams() {
  return SLUGS.map(slug => ({ slug }));
}

export const metadata = { title: "Categoría" };

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const slug = (params?.slug || "").toLowerCase();
  if (!SLUGS.includes(slug)) return notFound();

  const supabase = await createServerClient();
  const { data: items, error } = await supabase
    .from("productos")
    .select("id,nombre,precio,imagen_url,envio,destacado,categoria_slug")
    .eq("categoria_slug", slug)
    .order("id",{ ascending: true })
    .limit(12);

  if (error) {
    console.error("Supabase productos error:", error);
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {slug.charAt(0).toUpperCase() + slug.slice(1)}
        </h1>
        <p className="text-gray-600">Explora los mejores productos de {slug}.</p>
      </div>
      <ProductListClient items={items ?? []} />
    </section>
  );
}
