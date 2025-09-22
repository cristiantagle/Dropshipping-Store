import type { Metadata } from "next";
import "./globals.css";

// IMPORTS DE CLIENTE — SOLO COMO JSX en <body>
import ClientEffects from "@/components/ClientEffects";
import FloatingCart from "@/components/FloatingCart";
import BackToTop from "@/components/BackToTop";
// (Opcional) Header/Nav/Logo si son server components, impórtalos normal
// Si alguno usa hooks, conviértelo a client y se montará igual sin tocar aquí.

/**
 * IMPORTANTE:
 * - Este layout es SERVER COMPONENT (NO "use client").
 * - No uses hooks aquí. Si necesitas efectos, úsalos en ClientEffects.
 */

export const metadata: Metadata = {
  title: "Lunaria",
  description: "Tienda simple y bonita",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-white text-neutral-900 antialiased">
        {/* Efectos globales del lado cliente (sin UI) */}
        <ClientEffects />
        {/* App */}
        {children}
        {/* UI flotante cliente */}
        <FloatingCart />
        <BackToTop />
      </body>
    </html>
  );
}
