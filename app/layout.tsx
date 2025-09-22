import type { Metadata } from "next";
import "./globals.css";
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
      <body className={`bg-white text-neutral-900 ${inter.className}`}>
        {children}
        <FloatingCart />
        <PreviewBadge />
      </body>
    </html>
  );
}
