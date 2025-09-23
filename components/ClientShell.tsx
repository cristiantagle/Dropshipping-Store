'use client';
import React from "react";
import TopBar from "@/components/TopBar";
import FloatingCart from "@/components/FloatingCart";
import BackToTop from "@/components/BackToTop";
import PreviewBadge from "@/components/PreviewBadge";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Barra superior fija con botón Volver condicional (dentro de TopBar) */}
      <TopBar />

      {/* Contenedor de página (respeta el spacer de TopBar con h-16) */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {children}
      </div>

      {/* UI flotante existente */}
      <FloatingCart />
      <BackToTop />
      <PreviewBadge />
    </>
  );
}
