"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Producto } from "@/lib/products";
import { getCart, removeFromCart } from "@/components/useCart";

export default function Carro() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const sync = () => setProductos(getCart());
    sync();
    window.addEventListener("carro:updated", sync);
    return () => window.removeEventListener("carro:updated", sync);
  }, []);

  const eliminar = (id: string) => {
    removeFromCart(id);
    setProductos(getCart());
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>
      {productos.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((p) => (
            <li key={p.id}>
              <div className="border p-4 rounded shadow">
                <img src={p.imagen || ""} alt={p.nombre} className="w-full h-40 object-cover mb-2" />
                <h2 className="text-lg font-semibold">{p.nombre}</h2>
                <p className="text-md font-bold mt-2">${p.precio}</p>
                <p className="text-xs text-gray-500">{p.envio}</p>
                <button onClick={() => eliminar(p.id)} className="mt-2 text-red-600 underline text-sm">
                  Eliminar del carrito
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link href="/checkout" className="mt-6 inline-block bg-black text-white px-4 py-2 rounded">
        Ir al checkout
      </Link>
    </main>
  );
}
