'use client';

import React from "react";

function goBack() {
  if (typeof window === "undefined") return;
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "/";
  }
}

/**
 * Botón Volver flotante (bottom-left), con sombra y contraste alto.
 * No interfiere con el carrito flotante (que suele ir bottom-right).
 */
export default function FloatingBack() {
  return (
    <button
      onClick={goBack}
      aria-label="Volver a la página anterior"
      title="Volver"
      className="fixed left-4 bottom-4 z-[60] rounded-full px-4 py-2 text-white font-medium shadow-lg hover:shadow-xl transition
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/20
                 back-fab-bg"
      style={{ backdropFilter: "saturate(130%) blur(4px)" }}
    >
      ← Volver
    </button>
  );
}
