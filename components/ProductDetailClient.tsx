'use client';

import { useOptimizedCart } from '@/contexts/OptimizedCartContext';
import { ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';

type BasicProduct = {
  id: string;
  name: string;
  name_es?: string;
  description?: string | null;
  description_es?: string | null;
  image_url: string | null;
  price_cents: number;
  category_slug?: string | null;
};

export default function ProductDetailClient({ producto }: { producto: BasicProduct }) {
  const { add: agregarAlCarro } = useOptimizedCart();

  const fmtCLP = (cents: number) =>
    Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(cents);

  return (
    <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
      {/* Imagen */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm">
        <Image
          src={producto.image_url || '/lunaria-icon.png'}
          alt={producto.name_es || producto.name || 'Producto'}
          width={1200}
          height={900}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          priority={false}
        />
      </div>

      {/* Detalles */}
      <div>
        <h1 className="font-display mb-4 text-3xl font-bold text-gray-900">
          {producto.name_es || producto.name}
        </h1>
        <p className="mb-6 leading-relaxed text-gray-600">
          {producto.description_es || producto.description || 'Sin descripción disponible.'}
        </p>

        <p className="mb-8 text-2xl font-semibold text-lime-700">{fmtCLP(producto.price_cents)}</p>

        <button
          onClick={() =>
            agregarAlCarro({
              ...producto,
              image_url: producto.image_url || '/lunaria-icon.png',
              category_slug: producto.category_slug ?? undefined,
            })
          }
          className="w-full rounded-xl bg-black px-6 py-3 font-medium text-white shadow-md transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98] md:w-auto"
        >
          Agregar al carro
        </button>

        {/* Bloque de confianza */}
        <div className="mt-8 flex flex-col gap-6 text-sm text-gray-600 sm:flex-row">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-lime-600" />
            <span>Envío rápido a todo Chile</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-lime-600" />
            <span>Pago seguro garantizado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
