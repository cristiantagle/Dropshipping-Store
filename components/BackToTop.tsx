"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 left-6 z-[60] rounded-full bg-emerald-600 text-white shadow-lg px-4 py-3 text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition"
    >
      ↑ Arriba
      <span className="sr-only">Volver al inicio de la página</span>
    </button>
  );
}
