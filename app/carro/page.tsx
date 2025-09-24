"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Producto } from "@/lib/products";
import { supabase } from "@/lib/supabase/client";

export default function Carro() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const key = "carro";

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar productos:", error);
        return;
      }

      setProductos(data || []);
    };

    fetchProductos();
  }, []);

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
                <img src={p.imagen || p.image || ""} alt={p.nombre} className="w-full h-40 object-cover mb-2" />
                <h2 className="text-lg font-semibold">{p.nombre}</h2>
                <p className="text-sm text-gray-600">{p.descripcion}</p>
                <p className="text-md font-bold mt-2">${p.precio}</p>
                <p className="text-xs text-gray-500">{p.envio}</p>
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
