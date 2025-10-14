"use client";

import { useOptimizedCart } from "@/contexts/OptimizedCartContext";
import { ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

export default function ProductDetailClient({ producto }: { producto: any }) {
  const { add: agregarAlCarro } = useOptimizedCart();

  const fmtCLP = (cents: number) =>
    Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(cents);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Imagen */}
      <div className="aspect-[4/3] w-full bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
        <Image
          src={producto.image_url || "/lunaria-icon.png"}
          alt={producto.name_es || producto.name || 'Producto'}
          width={1200}
          height={900}
          unoptimized
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          priority={false}
        />
      </div>

      {/* Detalles */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          {producto.name_es || producto.name}
        </h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          {producto.description_es || producto.description || "Sin descripción disponible."}
        </p>

        <p className="text-2xl font-semibold text-lime-700 mb-8">
          {fmtCLP(producto.price_cents)}
        </p>

        <button
          onClick={() => agregarAlCarro(producto)}
          className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-xl font-medium shadow-md hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
        >
          Agregar al carro
        </button>

        {/* Bloque de confianza */}
        <div className="mt-8 flex flex-col sm:flex-row gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-lime-600" />
            <span>Envío rápido a todo Chile</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-lime-600" />
            <span>Pago seguro garantizado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
