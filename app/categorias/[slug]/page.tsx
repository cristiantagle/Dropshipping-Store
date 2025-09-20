import { notFound } from "next/navigation";
import ProductListClient, { Producto } from "@/components/ProductListClient";
import { createServerClient } from "@/lib/supabase/server";
import { getCategoriaBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageProps = { params: { slug: string } };

export default async function CategoriaPage({ params }: PageProps) {
  const cat = getCategoriaBySlug(params.slug);
  if (!cat) return notFound();

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("productos")
    .select(
      "id,nombre,precio,envio,imagen,imagen_url,image_url,image,categoria_slug"
    )
    .eq("categoria_slug", params.slug)
    .order("id", { ascending: true })
    .limit(12);

  if (error) {
    console.error("Supabase productos error:", error);
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
