"use client";
import Link from "next/link";
import { getProducto } from "@/lib/products";

export default async function Producto({ params }) {
  const prod = await getProducto(params.id);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100">
            <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h1 className="text-2xl font-bold">{prod.nombre}</h1>
          <div className="mt-3 text-2xl font-black lunaria-price">
            {Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              maximumFractionDigits: 0,
            }).format(prod.precio)}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="lunaria-cta px-5 py-3 font-semibold"
              onClick={() => alert(`Agregado: ${prod.nombre}`)}
            >
              Agregar al carrito
            </button>
            <Link className="btn-brand" href="/">Volver al inicio</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
