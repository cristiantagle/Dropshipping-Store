import { supabaseServer } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";

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
    .select("id, name, description, image_url, price_cents, category_slug")
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

      {!productos || productos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-lg font-medium">No hay productos en esta categoría.</p>
          <p className="text-sm mt-1">Vuelve pronto — estamos agregando nuevas colecciones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              image_url={p.image_url}
              price_cents={p.price_cents}
            />
          ))}
        </div>
      )}
    </main>
  );
}
