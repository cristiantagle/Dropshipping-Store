import Topbar from "@/components/Topbar";
import TopBar from "@/components/TopBar";
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
    <TopBar />
      <Topbar />
        <div className="bg-white text-neutral-900">
          <div className="bg-white text-neutral-900">
        {children}
      </div>
          <footer className="bg-white text-neutral-900">
            <span>© {new Date().getFullYear()} Lunaria</span>
            <a href="/categorias" className="bg-white text-neutral-900">
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