import { Metadata } from 'next';

export function generateProductMetadata(product: {
  name: string;
  name_es?: string;
  description?: string;
  description_es?: string;
  price_cents: number;
  image_url: string;
  category_slug?: string;
}): Metadata {
  const title = product.name_es || product.name;
  const description = product.description_es || product.description || `${title} - Compra online en Lunaria`;
  const price = (product.price_cents / 100).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP'
  });

  return {
    title: `${title} - Lunaria`,
    description,
    keywords: [
      title,
      product.category_slug || '',
      'compra online',
      'Chile',
      'e-commerce',
      'dropshipping'
    ].filter(Boolean).join(', '),
    openGraph: {
      title: `${title} - ${price}`,
      description,
      images: [
        {
          url: product.image_url,
          width: 500,
          height: 500,
          alt: title
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${price}`,
      description,
      images: [product.image_url]
    }
  };
}

export function generateCategoryMetadata(category: {
  nombre: string;
  slug: string;
  productCount?: number;
}): Metadata {
  const title = `${category.nombre} - Lunaria`;
  const description = `Descubre productos de ${category.nombre.toLowerCase()} en Lunaria. ${
    category.productCount ? `${category.productCount} productos disponibles.` : ''
  } Envío a todo Chile.`;

  return {
    title,
    description,
    keywords: [
      category.nombre,
      category.slug,
      'compra online Chile',
      'e-commerce',
      'productos'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website'
    }
  };
}

export function generateSearchMetadata(query?: string): Metadata {
  const title = query ? `Búsqueda: "${query}" - Lunaria` : 'Buscar Productos - Lunaria';
  const description = query 
    ? `Resultados de búsqueda para "${query}" en Lunaria. Encuentra productos y ofertas exclusivas.`
    : 'Busca productos en Lunaria. Miles de productos con envío a todo Chile.';

  return {
    title,
    description,
    keywords: query 
      ? `${query}, búsqueda, productos, Chile`
      : 'buscar productos, e-commerce Chile, compra online'
  };
}

export function getPageMetadata({
  title,
  description,
  path,
  keywords = []
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const fullTitle = `${title} - Lunaria`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lunaria.cl';
  const url = `${baseUrl}${path}`;
  
  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'Chile', 'e-commerce', 'compra online'].join(', '),
    alternates: {
      canonical: url
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website',
      siteName: 'Lunaria'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description
    }
  };
}
