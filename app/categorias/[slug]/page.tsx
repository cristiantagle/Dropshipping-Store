import { supabaseServer } from '@/lib/supabase/server';
import CategoryPageClient from '@/components/CategoryPageClient';
import Breadcrumb from '@/components/Breadcrumb';

// ✅ Deshabilitar cache en desarrollo para datos siempre frescos
export const dynamic = 'force-dynamic'; // SSR siempre
export const revalidate = 0; // Sin cache

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await supabaseServer();

  // Obtener categoría
  const { data: categoriaData, error: catError } = await supabase
    .from('categories')
    .select('nombre, slug')
    .eq('slug', slug)
    .single();

  if (catError) {
    console.error('Error cargando categoría:', catError.message);
  }

  // Obtener productos de la categoría
  const { data: productos, error: prodError } = await supabase
    .from('products')
    .select('id, name, name_es, description, image_url, price_cents, category_slug') // 👈 añadimos name_es
    .eq('category_slug', slug);

  if (prodError) {
    console.error('Error cargando productos:', prodError.message);
  }

  const nombreCategoria = categoriaData?.nombre || 'Categoría';

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Categorías', href: '/categorias' },
          { label: nombreCategoria },
        ]}
      />

      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900">
          {nombreCategoria}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Explora los productos seleccionados para esta categoría.
        </p>
      </div>

      <CategoryPageClient productos={productos || []} nombreCategoria={nombreCategoria} />
    </main>
  );
}
