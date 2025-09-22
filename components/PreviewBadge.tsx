"use client";
import React from "react";

function isPreview(): boolean {
  const env = (process.env.NEXT_PUBLIC_VERCEL_ENV || "").toLowerCase();
  if (env && env !== "production") return true;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("-git-")) return true; // Vercel Preview URLs
  }
  return false;
}

export default function PreviewBadge() {
  if (!isPreview()) return null;
  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "preview";
  const sha = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "").slice(0,7) || "no-sha";
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <span className="pointer-events-auto select-none rounded-full bg-black/80 text-white text-xs px-3 py-1.5 shadow-md backdrop-blur">
        preview • <strong>{ref}</strong> • {sha}
      </span>
    </div>
  );
}
