import { supabaseServer } from "@/lib/supabase/server";
import CategoryPageClient from "@/components/CategoryPageClient";
import Breadcrumb from "@/components/Breadcrumb";

// ✅ Deshabilitar cache en desarrollo para datos siempre frescos
export const dynamic = 'force-dynamic'; // SSR siempre
export const revalidate = 0; // Sin cache

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const supabase = supabaseServer();

  // Obtener categoría
  const { data: categoriaData, error: catError } = await supabase
    .from("categories")
    .select("nombre, slug")
    .eq("slug", params.slug)
    .single();

  if (catError) {
    console.error("Error cargando categoría:", catError.message);
  }

  // Obtener productos de la categoría
  const { data: productos, error: prodError } = await supabase
    .from("products")
    .select("id, name, name_es, description, image_url, price_cents, category_slug") // 👈 añadimos name_es
    .eq("category_slug", params.slug);

  if (prodError) {
    console.error("Error cargando productos:", prodError.message);
  }

  const nombreCategoria = categoriaData?.nombre || "Categoría";

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Categorías", href: "/categorias" },
          { label: nombreCategoria },
        ]}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900">
          {nombreCategoria}
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Explora los productos seleccionados para esta categoría.
        </p>
      </div>

      <CategoryPageClient 
        productos={productos || []} 
        nombreCategoria={nombreCategoria}
      />
    </main>
  );
}