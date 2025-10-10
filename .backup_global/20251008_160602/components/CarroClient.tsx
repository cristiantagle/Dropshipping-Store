"use client";
import { useCart } from "@/components/useCart";

export default function CarroClient() {
  const { items, remove } = useCart();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">El carrito está vacío.</p>
      ) : (
        <ul>
          {items.map((p) => (
            <li key={p.id} className="flex justify-between border-b py-2">
              <span>{p.name}</span>
              <button
                onClick={() => remove(p.id)}
                className="text-red-600 hover:underline"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
