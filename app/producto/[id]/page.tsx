import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import ProductDetail from '@/components/ProductDetail';
import Breadcrumb from '@/components/Breadcrumb';
import { getCategory } from '@/lib/categorias';

// ✅ Deshabilitar cache en desarrollo para datos siempre frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();

  if (!product) return notFound();

  const { data: relacionados } = await supabase.from('products').select('*').limit(4);

  const cat = product?.category_slug ? getCategory(product.category_slug) : undefined;
  const crumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorías', href: '/categorias' },
    ...(cat && product?.category_slug
      ? [{ label: cat.nombre, href: `/categorias/${product.category_slug}` }]
      : []),
    { label: product.name_es || product.name },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      {/* JSON-LD Product schema */}
      {(() => {
        const site = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
        const images =
          Array.isArray(product?.images) && product.images.length > 0
            ? product.images
            : [product.image_url].filter(Boolean);
        const price = Math.round((product.price_cents / 100) * MARKUP);
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name_es || product.name,
          image: images,
          description:
            product.description_es || product.description || product.name_es || product.name,
          sku: product.id,
          url: `${site}/producto/${product.id}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'CLP',
            price: String(price),
            availability: 'https://schema.org/InStock',
            url: `${site}/producto/${product.id}`,
          },
        };
        return (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        );
      })()}
      <Breadcrumb items={crumbs} />
      <ProductDetail product={product} relacionados={relacionados || []} />
    </main>
  );
}
