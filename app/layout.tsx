import FloatingCart from "@/components/FloatingCart";
import type { Metadata } from "next";
import FloatingCart from "@/components/FloatingCart";
import "./globals.css";
import FloatingCart from "@/components/FloatingCart";
import { Inter } from "next/font/google";
import FloatingCart from "@/components/FloatingCart";

import FloatingCart from "@/components/FloatingCart";
const inter = Inter({ subsets: ["latin"] });
import FloatingCart from "@/components/FloatingCart";

import FloatingCart from "@/components/FloatingCart";
export const metadata: Metadata = {
import FloatingCart from "@/components/FloatingCart";
  title: "Lunaria",
import FloatingCart from "@/components/FloatingCart";
  description: "Tienda simple y bonita",
import FloatingCart from "@/components/FloatingCart";
};
import FloatingCart from "@/components/FloatingCart";

import FloatingCart from "@/components/FloatingCart";
export default function RootLayout({children}
        <FloatingCart />: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-b from-white to-gray-50 text-gray-800`}>
        <div className="mx-auto max-w-6xl px-4 py-6">
          {children}
        <FloatingCart />
          <footer className="mt-12 text-sm text-gray-500 flex items-center justify-between border-t pt-6">
            <span>© {new Date().getFullYear()} Lunaria</span>
            <a href="/categorias" className="text-emerald-700 hover:text-emerald-800 font-semibold">
              Explorar categorías →
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
