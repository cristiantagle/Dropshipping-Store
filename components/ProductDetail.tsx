'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import { useProductText } from '@/lib/useProductText';
import { formatPrice } from '@/lib/formatPrice';

type ProductDetailProduct = {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  images?: string[];
  price_cents: number;
  category_slug?: string;
  envio?: string | null;
  envio_gratis?: boolean;
  shipping_days_min?: number | null;
  shipping_days_max?: number | null;
};

type RelatedProduct = {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
  badge?: 'Nuevo' | 'Oferta';
};

export default function ProductDetail({
  product,
  relacionados,
}: {
  product: ProductDetailProduct;
  relacionados: RelatedProduct[];
}) {
  const { name, shortDesc, longDesc } = useProductText(product);
  const tabs = ['descripcion', 'envio', 'opiniones'] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('descripcion');
  // Build gallery list: main CJ image + AI images (if any)
  const gallery: string[] = [product.image_url, ...(product.images || [])].filter(Boolean);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight' && gallery.length > 1)
        setActiveImageIdx((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft' && gallery.length > 1)
        setActiveImageIdx((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLightboxOpen, gallery.length]);

  useEffect(() => {
    if (isLightboxOpen) closeBtnRef.current?.focus();
  }, [isLightboxOpen]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    const prev = body.style.overflow;
    if (isLightboxOpen) body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prev;
    };
  }, [isLightboxOpen, mounted]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Galería */}
        <div>
          <button
            type="button"
            aria-label="Ver imagen a pantalla completa"
            onClick={() => setLightboxOpen(true)}
            className="block w-full"
          >
            <Image
              src={gallery[activeImageIdx]}
              alt={name ?? product?.name ?? 'Producto'}
              width={800}
              height={384}
              unoptimized
              className="h-96 w-full transform rounded-lg object-contain shadow-md transition duration-300 ease-out hover:scale-105 hover:shadow-xl"
              priority={false}
            />
          </button>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {gallery.map((img: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Imagen ${i + 1}`}
                  aria-current={i === activeImageIdx}
                  onClick={() => setActiveImageIdx(i)}
                  className={`rounded-md border transition-transform duration-200 hover:scale-110 focus:outline-none ${
                    i === activeImageIdx ? 'border-lime-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${name ?? product?.name ?? 'Producto'} ${i + 1}`}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-20 w-20 rounded-md object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {false && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Vista de imagen"
            onClick={(e) => {
              if (e.currentTarget === e.target) setLightboxOpen(false);
            }}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((i) => (i - 1 + gallery.length) % gallery.length)
                  }
                  className="absolute left-4 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none md:left-6"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i + 1) % gallery.length)}
                  className="absolute right-4 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none md:right-6"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}

            <div className="max-h-[85vh] w-full max-w-5xl">
              <Image
                src={gallery[activeImageIdx]}
                alt={name ?? product?.name ?? 'Producto'}
                width={1600}
                height={1200}
                unoptimized
                className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
                priority={false}
              />
            </div>
          </div>
        )}

        {/* Lightbox via portal to avoid stacking issues */}
        {mounted &&
          isLightboxOpen &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Vista de imagen"
              onClick={(e) => {
                if (e.currentTarget === e.target) setLightboxOpen(false);
              }}
            >
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Cerrar"
              >
                X
              </button>

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((i) => (i - 1 + gallery.length) % gallery.length)
                    }
                    className="absolute left-4 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none md:left-6"
                    aria-label="Anterior"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIdx((i) => (i + 1) % gallery.length)}
                    className="absolute right-4 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none md:right-6"
                    aria-label="Siguiente"
                  >
                    Next
                  </button>
                </>
              )}

              <div className="max-h-[85vh] w-full max-w-5xl">
                <Image
                  src={gallery[activeImageIdx]}
                  alt={name ?? product?.name ?? 'Producto'}
                  width={1600}
                  height={1200}
                  unoptimized
                  className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
                  priority={false}
                />
              </div>
            </div>,
            document.body,
          )}

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="mb-2 text-3xl font-bold">{name}</h1>
          <p className="mb-4 text-2xl font-bold text-lime-700">
            {formatPrice(product.price_cents)}
          </p>
          {shortDesc && <p className="mb-4 text-gray-600">{shortDesc}</p>}
          <div className="w-full md:w-auto">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                name_es: product.name_es,
                image_url: product.image_url,
                price_cents: product.price_cents,
                category_slug: product.category_slug,
              }}
              className="w-full"
            />
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === tab ? 'border-b-2 border-lime-600 text-lime-600' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'descripcion' ? 'Descripción' : tab === 'envio' ? 'Envío' : 'Opiniones'}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeTab === 'descripcion' && (
                <p className="whitespace-pre-line text-gray-700">
                  {longDesc || 'Sin descripción disponible.'}
                </p>
              )}
              {activeTab === 'envio' && (
                <div>
                  <p className="text-gray-700">
                    {product.envio || 'Envío estándar'}{' '}
                    {product.envio_gratis && (
                      <span className="font-bold text-lime-600">(Gratis)</span>
                    )}
                  </p>
                  {product.shipping_days_min && (
                    <p className="text-sm text-gray-500">
                      Tiempo estimado: {product.shipping_days_min} - {product.shipping_days_max}{' '}
                      días
                    </p>
                  )}
                </div>
              )}
              {activeTab === 'opiniones' && (
                <p className="text-gray-500 italic">Aún no hay reseñas para este producto.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {relacionados?.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">También te puede interesar</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relacionados.map((p: any) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
