"use client";
import { useEffect } from "react";

/**
 * Efectos globales del lado cliente. NO exporta UI visible.
 * Coloca portales, listeners, etc. siempre aquí (no en layout).
 */
export default function ClientEffects() {
  useEffect(() => {
    // Portal para overlays si hace falta
    let portal = document.getElementById("portal-ui");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "portal-ui";
      document.body.appendChild(portal);
    }
    return () => {
      // dejamos el portal; no lo removemos para evitar parpadeos
    };
  }, []);
  return null;
}
