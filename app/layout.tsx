import Topbar from "@/components/Topbar";
import ClientEffects from "@/components/ClientEffects";
import type { Metadata } from "next";
import "./globals.css";
import BackNav from "@/components/BackNav";
import BackToTopGuard from "@/components/BackToTopGuard";
import { Inter } from "next/font/google";
import FloatingCart from "@/components/FloatingCart";
import PreviewBadge from "@/components/PreviewBadge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lunaria",
  description: "Tienda simple y bonita",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-b from-white to-gray-50 text-gray-800`}>
      <ClientEffects />
      <Topbar />
        <div className="mx-auto max-w-6xl px-4 py-6">
          {children}
          <footer className="mt-12 text-sm text-gray-500 flex items-center justify-between border-t pt-6">
            <span>© {new Date().getFullYear()} Lunaria</span>
            <a href="/categorias" className="text-emerald-700 hover:text-emerald-800 font-semibold">
              Explorar categorías →
            </a>
          </footer>
        </div>
        <FloatingCart />
  <BackToTopGuard />
      <BackNav />
</body>
    </html>
  );
}
