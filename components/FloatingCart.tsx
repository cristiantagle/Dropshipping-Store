"use client";
import React from "react";

function getCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("carro") || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.length : 0;
  } catch { return 0; }
}

export default function FloatingCart() {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    setCount(getCount());
    const onStorage = (e: StorageEvent) => { if (e.key === "carro") setCount(getCount()); };
    const onCustom = () => setCount(getCount());
    window.addEventListener("storage", onStorage);
    window.addEventListener("carro:updated", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("carro:updated", onCustom as EventListener);
    };
  }, []);

  return (
    <button
      aria-label="Abrir carro"
      onClick={() => (window.location.href = "/carro")}
      className="fixed bottom-4 right-4 z-[9990] w-14 h-14 rounded-full shadow-lg border border-emerald-600/20 transition-transform hover:scale-105 active:scale-95"
      style={{ background: "linear-gradient(180deg, #2bb673 0%, #23a765 100%)", WebkitTapHighlightColor: "transparent" }}
      data-testid="floating-cart"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mx-auto text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" d="M3 3h2l.4 2M7 13h10l2-7H6.4M7 13l-1.3 5H19M7 13l-1.6-6M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 .001-2.001A1 1 0 0 0 18 21Z"/>
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[11px] font-semibold text-white bg-[#2bb673] ring-2 ring-white flex items-center justify-center shadow"
          aria-label={`Productos en el carro: ${count}`}
          data-testid="cart-badge"
        >
          {count}
        </span>
      )}
    </button>
  );
}
