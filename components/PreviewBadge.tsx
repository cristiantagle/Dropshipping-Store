"use client";
import React from "react";

export default function PreviewBadge() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview") return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <span className="px-4 py-1 rounded-full bg-emerald-600 text-white text-sm shadow-lg animate-bounce">
        PREVIEW
      </span>
    </div>
  );
}
