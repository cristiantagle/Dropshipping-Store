"use client";

import React from "react";

type Position = "bottom-center" | "bottom-left" | "bottom-right";

function shouldShowPreview(): boolean {
  // Preferimos variable pública
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || "";
  if (env.toLowerCase() === "preview") return true;

  // Fallback por ref (si el build injecta la rama)
  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "";
  if (ref.startsWith("preview/")) return true;

  // Último fallback: hostname típico de previews de vercel git (opcional)
  if (typeof window !== "undefined" && window.location.hostname.includes("-git-")) return true;

  return false;
}

export default function PreviewBadge({ position = "bottom-center" }: { position?: Position }) {
  if (!shouldShowPreview()) return null;

  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "preview";
  const sha = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "").slice(0, 7);

  let posClass = "fixed bottom-3 left-1/2 -translate-x-1/2";
  if (position === "bottom-left") posClass = "fixed bottom-3 left-3";
  if (position === "bottom-right") posClass = "fixed bottom-3 right-3";

  return (
    <div className={`${posClass} z-[60] pointer-events-none`}>
      <span className="pointer-events-auto select-none rounded-full bg-black/80 text-white text-xs px-3 py-1.5 shadow-md backdrop-blur">
        preview • <strong>{ref}</strong> • {sha}
      </span>
    </div>
  );
}
