import { supabaseServer } from "@/lib/supabase/server";
import ProductDetailClient from "@/components/ProductDetailClient";
import Breadcrumb from "@/components/Breadcrumb";

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();

  // Traer producto con category_slug
  const { data: producto, error: prodError } = await supabase
    .from("products")
    .select("id, name, description, image_url, price_cents, category_slug")
    .eq("id", params.id)
    .single();

  if (prodError || !producto) {
    console.error("[Producto] Error:", prodError?.message);
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Categorías", href: "/categorias" },
            { label: "Producto" },
          ]}
        />
        <p className="text-gray-600">Producto no encontrado.</p>
      </main>
    );
  }

  // Resolver categoría
  let categoriaNombre: string | null = null;
  let categoriaSlug: string | null = null;

  if (producto.category_slug) {
    const { data: categoria, error: catError } = await supabase
      .from("categories")
      .select("nombre, slug")
      .eq("slug", producto.category_slug)
      .single();

    if (!catError && categoria) {
      categoriaNombre = categoria.nombre;
      categoriaSlug = categoria.slug;
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Categorías", href: "/categorias" },
          categoriaNombre && categoriaSlug
            ? { label: categoriaNombre, href: `/categorias/${categoriaSlug}` }
            : { label: "Categoría" },
          { label: producto.name },
        ]}
      />
      <ProductDetailClient producto={producto} />
    </main>
  );
}
