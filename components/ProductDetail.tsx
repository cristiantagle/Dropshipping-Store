"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import { useProductText } from "@/lib/useProductText";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductDetail({ product, relacionados }: any) {
  const { name, shortDesc, longDesc } = useProductText(product);
  const [activeTab, setActiveTab] = useState<"descripcion" | "envio" | "opiniones">("descripcion");
  // Build gallery list: main CJ image + AI images (if any)
  const gallery: string[] = [product.image_url, ...(product.images || [])].filter(Boolean);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight" && gallery.length > 1) setActiveImageIdx((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft" && gallery.length > 1) setActiveImageIdx((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, gallery.length]);

  useEffect(() => {
    if (isLightboxOpen) closeBtnRef.current?.focus();
  }, [isLightboxOpen]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    const prev = body.style.overflow;
    if (isLightboxOpen) body.style.overflow = "hidden";
    return () => { body.style.overflow = prev; };
  }, [isLightboxOpen, mounted]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
              className="w-full h-96 object-contain rounded-lg shadow-md transform transition duration-300 ease-out hover:scale-105 hover:shadow-xl"
              priority={false}
            />
          </button>
          {gallery.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
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
                    className="w-20 h-20 object-contain rounded-md"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {false && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
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
              className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i - 1 + gallery.length) % gallery.length)}
                  className="absolute left-4 md:left-6 text-white bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i + 1) % gallery.length)}
                  className="absolute right-4 md:right-6 text-white bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}

            <div className="max-w-5xl w-full max-h-[85vh]">
              <Image
                src={gallery[activeImageIdx]}
                alt={name ?? product?.name ?? 'Producto'}
                width={1600}
                height={1200}
                unoptimized
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                priority={false}
              />
            </div>
          </div>
        )}

        {/* Lightbox via portal to avoid stacking issues */}
        {mounted && isLightboxOpen && createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Vista de imagen"
            onClick={(e) => { if (e.currentTarget === e.target) setLightboxOpen(false); }}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar"
            >
              X
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i - 1 + gallery.length) % gallery.length)}
                  className="absolute left-4 md:left-6 text-white bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Anterior"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i + 1) % gallery.length)}
                  className="absolute right-4 md:right-6 text-white bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Siguiente"
                >
                  Next
                </button>
              </>
            )}

            <div className="max-w-5xl w-full max-h-[85vh]">
              <Image
                src={gallery[activeImageIdx]}
                alt={name ?? product?.name ?? 'Producto'}
                width={1600}
                height={1200}
                unoptimized
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                priority={false}
              />
            </div>
          </div>,
          document.body
        )}

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-lime-700 font-bold text-2xl mb-4">{formatPrice(product.price_cents)}</p>
          {shortDesc && <p className="text-gray-600 mb-4">{shortDesc}</p>}
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
              {["descripcion", "envio", "opiniones"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === tab ? "border-b-2 border-lime-600 text-lime-600" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab === "descripcion" ? "Descripción" : tab === "envio" ? "Envío" : "Opiniones"}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeTab === "descripcion" && (
                <p className="text-gray-700 whitespace-pre-line">{longDesc || "Sin descripción disponible."}</p>
              )}
              {activeTab === "envio" && (
                <div>
                  <p className="text-gray-700">
                    {product.envio || "Envío estándar"}{" "}
                    {product.envio_gratis && <span className="text-lime-600 font-bold">(Gratis)</span>}
                  </p>
                  {product.shipping_days_min && (
                    <p className="text-gray-500 text-sm">
                      Tiempo estimado: {product.shipping_days_min} - {product.shipping_days_max} días
                    </p>
                  )}
                </div>
              )}
              {activeTab === "opiniones" && (
                <p className="text-gray-500 italic">Aún no hay reseñas para este producto.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {relacionados?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relacionados.map((p: any) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
