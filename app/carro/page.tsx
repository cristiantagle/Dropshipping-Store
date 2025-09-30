"use client";
import { useCarro } from "@/state/carro";

export default function CarroPage() {
  const { items, quitarDelCarro } = useCarro();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">
      <h1 className="text-2xl font-bold">Carrito</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <ul className="space-y-6">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <div className="w-24 h-24 overflow-hidden rounded-xl bg-gray-100">
                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{item.nombre}</div>
                <div className="text-sm text-gray-500">${item.precio}</div>
              </div>
              <button
                onClick={() => quitarDelCarro(item.id)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
