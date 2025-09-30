"use client";
import { getProductById } from "@/lib/products";
import { useCart } from "@/components/useCart";

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const producto = await getProductById(params.id);
  const { agregarAlCarro } = useCart();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 rounded-xl">
          <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-gray-600">{producto.descripcion}</p>
          <div className="text-2xl font-semibold text-lime-700">${producto.precio}</div>
          <button
            onClick={() => agregarAlCarro(producto)}
            className="px-6 py-3 bg-lime-600 text-white rounded-full font-semibold hover:bg-lime-700 transition"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
