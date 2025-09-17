import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AndesDrop — Tienda de Chile",
  description: "AndesDrop: tienda online con envíos en Chile. Pagos seguros con Mercado Pago."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">AndesDrop</Link>
            <nav className="flex gap-4">
              <Link href="/" className="hover:underline">Inicio</Link>
              <Link href="/categorias" className="hover:underline">Categorías</Link>
              <Link href="/carro" className="hover:underline">Carro</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t mt-16">
          <div className="container py-8 text-sm text-gray-500">
            © {new Date().getFullYear()} AndesDrop · Envíos a todo Chile
          </div>
        </footer>
      </body>
    </html>
  );
}
