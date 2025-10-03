import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lunaria",
  description: "E-commerce sustentable",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-lime-700">
              Lunaria
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-gray-700">
              <Link href="/categorias">Categorías</Link>
              <Link href="/carro">Carrito</Link>
              <Link href="/diag">Diag</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-white border-t mt-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-sm text-gray-500 text-center">
            © 2025 Lunaria — E-commerce sustentable
          </div>
        </footer>
      </body>
    </html>
  );
}
