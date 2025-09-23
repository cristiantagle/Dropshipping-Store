'use client';
import React from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import BackToTop from "@/components/BackToTop";
import PreviewBadge from "@/components/PreviewBadge";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Barra superior fija */}
      <TopBar />

      {/* Contenido */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {children}
      </div>

      {/* Footer al fondo */}
      <Footer />

      {/* UI flotante (no tapa el footer) */}
      <FloatingCart />
      <BackToTop />
      <PreviewBadge />
    </>
  );
}
