'use client';
import { useCallback } from "react";

export default function BackButton({
  fallbackHref = "/",
  className = "",
}: { fallbackHref?: string; className?: string }) {
  const goBack = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        if (window.history && window.history.length > 1) {
          window.history.back();
          return;
        }
      } catch {}
      window.location.href = fallbackHref;
    }
  }, [fallbackHref]);

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-2 rounded-xl bg-lime-600 px-3 py-2 text-white font-semibold hover:bg-lime-700 transition shadow-sm ${className}`}
      aria-label="Volver"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Volver</span>
    </button>
  );
}
