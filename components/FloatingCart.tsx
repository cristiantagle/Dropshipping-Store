"use client";
import { useState } from "react";

export default function FloatingCart() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-600 text-white rounded-full px-5 py-3 shadow-lg hover:bg-green-700 transition"
      >
        🛒 Carro
      </button>
      {open && (
        <div className="mt-3 w-72 bg-white shadow-2xl rounded-xl p-4 animate-slideIn">
          <h3 className="font-bold mb-2">Tu carrito</h3>
          <p className="text-sm text-neutral-500">Aquí aparecerán tus productos.</p>
        </div>
      )}
    </div>
  );
}
