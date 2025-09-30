import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lunaria",
  description: "E-commerce sustentable",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-lime-700">Lunaria</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/categorias" className="hover:underline">Categorías</Link>
              <Link href="/carro" className="hover:underline">Carrito</Link>
              <Link href="/diag" className="hover:underline text-gray-400">Diag</Link>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Lunaria — E-commerce sustentable
          </div>
        </footer>
      </body>
    </html>
  );
}
