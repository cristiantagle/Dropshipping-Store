"use client";
import React from "react";

type Position = "bottom-center" | "bottom-left" | "bottom-right";

function isPreview(): boolean {
  const env = (process.env.NEXT_PUBLIC_VERCEL_ENV || "").toLowerCase();
  if (env && env !== "production") return true;
  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "";
  if (ref.startsWith("preview/")) return true;
  if (typeof window !== "undefined" && window.location.hostname.includes("-git-")) return true;
  return false;
}

export default function PreviewBadge({ position = "bottom-center" }: { position?: Position }) {
  if (!isPreview()) return null;
  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "preview";
  const sha = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "").slice(0, 7);

  let posClass = "fixed bottom-3 left-1/2 -translate-x-1/2";
  if (position === "bottom-left") posClass = "fixed bottom-3 left-3";
  if (position === "bottom-right") posClass = "fixed bottom-3 right-3";

  return (
    <div className={`${posClass} z-[9999] pointer-events-none`} data-testid="preview-badge">
      <span className="pointer-events-auto select-none rounded-full bg-black/80 text-white text-xs px-3 py-1.5 shadow-md backdrop-blur">
        preview • <strong>{ref}</strong> • {sha || "no-sha"}
      </span>
    </div>
  );
}
