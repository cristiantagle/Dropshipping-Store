import "./globals.css";
import Link from "next/link";
import PreviewTag from "../components/PreviewTag";

export const metadata = {
  title: "Lunaria — Tienda en Chile",
  description: "Lunaria: compra fácil, envíos a todo Chile y pagos con Mercado Pago."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b bg-white/70 backdrop-blur">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">Lunaria</Link>
            <nav className="flex gap-4">
              <Link href="/" className="hover:underline">Inicio</Link>
              <Link href="/categorias" className="hover:underline">Categorías</Link>
              <Link href="/carro" className="hover:underline">Carro</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8 space-y-10">
          {children}
          <PreviewTag />
        </main>
        <footer className="border-t">
          <div className="container py-8 text-sm text-gray-500">
            © {new Date().getFullYear()} Lunaria · Envíos a todo Chile
          </div>
        </footer>
      </body>
    </html>
  );
}
