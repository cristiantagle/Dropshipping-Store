// 'use client' porque toca el DOM
'use client';
import { useEffect, useState } from "react";

const SELECTORS = [
  ".back-to-top",
  "#backtotop",
  "[data-backtotop]",
  'a[href="#top"]',
  'button[aria-label*="arriba" i]',
  'button[aria-label*="top" i]'
].join(", ");

export default function BackToTopGuard() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Si ya existe un botón, lo forzamos a aparecer
    const existing = document.querySelector(SELECTORS) as HTMLElement | null;
    if (existing) {
      existing.style.opacity = "1";
      existing.style.visibility = "visible";
      existing.style.pointerEvents = "auto";
      existing.style.transform = "none";
      existing.style.position = existing.style.position || "fixed";
      if (!existing.hasAttribute("data-backtotop")) {
        existing.setAttribute("data-backtotop", "1");
      }
      return; // No renderizamos nuestro fallback
    }

    const onScroll = () => setShow(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      data-backtotop
      aria-label="Subir al inicio"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-4 left-4 md:left-auto md:right-28 z-[95] inline-flex h-12 w-12 items-center justify-center rounded-full bg-lime-600 text-white shadow-lg transition active:scale-95 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lime-600"
    >
      <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true">
        <path d="M10 5l-6 6h4v4h4v-4h4l-6-6z" />
      </svg>
      <span className="sr-only">Volver arriba</span>
    </button>
  );
}
