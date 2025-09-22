"use client";

import React from "react";

function getCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("carro") || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function FloatingCart() {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    // init
    setCount(getCount());

    const onStorage = (e: StorageEvent) => {
      if (e.key === "carro") setCount(getCount());
    };
    const onCustom = () => setCount(getCount());

    window.addEventListener("storage", onStorage);
    window.addEventListener("carro:updated", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("carro:updated", onCustom as EventListener);
    };
  }, []);

  const openCarro = () => {
    // Navega a /carro (manteniendo comportamiento simple)
    window.location.href = "/carro";
  };

  return (
    <button
      aria-label="Abrir carro"
      onClick={openCarro}
      className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg bg-white border border-neutral-200 hover:shadow-xl transition-transform hover:scale-105 w-14 h-14 flex items-center justify-center"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Ícono simple de bolsa */}
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeWidth="1.8" d="M6 7h12l-1 12H7L6 7Z" />
        <path strokeWidth="1.8" d="M9 7a3 3 0 1 1 6 0" />
      </svg>

      {/* Badge ÚNICO (verde Lunaria) */}
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[11px] font-semibold text-white bg-[#2bb673] flex items-center justify-center shadow"
          aria-label={`Productos en el carro: ${count}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
