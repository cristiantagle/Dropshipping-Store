"use client";

import React from "react";

type Position = "bottom-center" | "bottom-left" | "bottom-right";

export default function PreviewBadge({ position = "bottom-center" }: { position?: Position }) {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || "local";
  if (env !== "preview") return null;

  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "preview";
  const sha = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "").slice(0, 7);

  let posClass =
    "fixed bottom-3 left-1/2 -translate-x-1/2"; // bottom-center (default)
  if (position === "bottom-left") posClass = "fixed bottom-3 left-3";
  if (position === "bottom-right") posClass = "fixed bottom-3 right-3";

  return (
    <div className={`${posClass} z-30`}>
      <span className="select-none rounded-full bg-black/75 text-white text-xs px-3 py-1.5 shadow backdrop-blur">
        preview • <strong>{ref}</strong> • {sha}
      </span>
    </div>
  );
}
