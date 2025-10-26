import type { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const now = new Date();

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${site}/categorias`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${site}/ofertas`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${site}/buscar`, lastModified: now, changeFrequency: 'daily', priority: 0.5 },
  ];

  // Fetch categories (distinct slugs) and products
  try {
    const sb = supabaseAdmin();
    const { data: catRows } = await sb
      .from('products')
      .select('category_slug')
      .not('category_slug', 'is', null)
      .limit(5000);
    const slugs = Array.from(new Set((catRows || []).map((r: any) => r.category_slug))).filter(
      Boolean,
    );
    for (const slug of slugs) {
      routes.push({
        url: `${site}/categorias/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    const { data: products } = await sb
      .from('products')
      .select('id, updated_at')
      .not('image_url', 'is', null)
      .limit(10000);
    for (const p of products || []) {
      routes.push({
        url: `${site}/producto/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    // On failure, keep base routes only
  }

  return routes;
}
