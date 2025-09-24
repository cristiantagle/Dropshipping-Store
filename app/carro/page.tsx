"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "../../lib/products";
import { fmtCLP } from "../../lib/format";

export default function Carro() {
  const key = "carro";
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        setItems([]);
      }
    }
  }, []);

  if (items.length === 0) {
    return <p className="text-center text-gray-500">Tu carrito está vacío</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between border-b pb-2">
            <span>{item.name}</span>
            <span>{fmtCLP(item.price)}</span>
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded">
        Seguir comprando
      </Link>
    </div>
  );
}
