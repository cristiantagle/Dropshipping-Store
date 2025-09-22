"use client";
import { useEffect } from "react";

/**
 * Monta efectos globales del lado del cliente.
 * - Arregla BackToTop: asegura que exista el contenedor en el DOM.
 * - (Espacio para otros efectos: medir scroll, listeners, etc.)
 */
export default function ClientEffects() {
  useEffect(() => {
    // Ejemplo: asegurar que el contenedor #portal-ui exista (por si algún overlay/badge lo usa)
    let portal = document.getElementById("portal-ui");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "portal-ui";
      document.body.appendChild(portal);
    }
    return () => {
      // No desmontamos el portal; otros componentes pueden reutilizarlo
    };
  }, []);

  return null;
}
