import type { Metadata } from "next";
import "./globals.css";

import TopBar from "@/components/TopBar";
import BackNav from "@/components/BackNav";
import BackToTopGuard from "@/components/BackToTopGuard";
import FloatingCart from "@/components/FloatingCart";
import PreviewBadge from "@/components/PreviewBadge";

export const metadata: Metadata = {
  title: "Lunaria",
  description: "Tienda simple y bonita",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-800">
        <TopBar />
        <div className="container-lunaria pt-16">
          <BackNav />
        </div>
        <main className="container-lunaria py-6">
          {children}
        </main>
        <BackToTopGuard />
        <FloatingCart />
        <div className="preview-center">
          <PreviewBadge />
        </div>
      </body>
    </html>
  );
}
