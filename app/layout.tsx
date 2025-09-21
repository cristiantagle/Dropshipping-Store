import "./globals.css";
import React from "react";
import HeaderClient from "@/components/HeaderClient";

// Carga segura del PreviewBadge (default) si existe
let PreviewBadge: React.ComponentType | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("@/components/PreviewBadge");
  PreviewBadge = (mod?.default ?? null) as any;
} catch {}

export const metadata = {
  title: "Lunaria",
  description: "Descubre productos buenos, útiles y bonitos — curados para ti.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-dvh bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-neutral-950/60 border-b">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-extrabold text-xl tracking-tight">
              Lunaria
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/categorias" className="hover:opacity-80 transition">Categorías</a>
              <a href="/carro" className="hover:opacity-80 transition">Carro</a>
            </nav>
            <HeaderClient />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 space-y-10 lunaria-enter">
          {children}
        </main>

        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Lunaria — Hecho con cariño.
          </div>
        </footer>

        {PreviewBadge ? <PreviewBadge /> : null}
      </body>
    </html>
  );
}
