"use client";
import * as React from "react";

/**
 * Muestra un badge con el entorno/branch/sha solo en preview/dev.
 * Posición: BOTTOM CENTER para no chocar con el carrito flotante.
 */
export default function PreviewBadge() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || "";
  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "";
  const sha = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "").slice(0, 7);

  const isPreview = env && env !== "production";
  if (!isPreview) return null;

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" }}
    >
      <div className="rounded-full bg-neutral-900/85 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 border border-white/10 backdrop-blur">
        <span className="opacity-80">Preview</span>
        {ref ? <span className="mx-2 opacity-50">•</span> : null}
        {ref ? <span className="font-medium">{ref}</span> : null}
        {sha ? <span className="ml-2 px-1.5 py-0.5 rounded bg-white/10 font-mono">{sha}</span> : null}
      </div>
    </div>
  );
}
