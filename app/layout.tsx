import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { CartProvider } from "../contexts/CartContext";
import ShoppingCart from "@/components/ShoppingCart";

export const metadata = {
  title: "Lunaria",
  description: "Cosas útiles y bonitas. E-commerce sustentable con envíos simples.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="description" content="Descubre productos útiles, bonitos y sustentables en Lunaria. Envíos simples, calidad real." />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <CartProvider>
          <TopBar />
          {children}
          <Footer />
          <ShoppingCart />
        </CartProvider>
      </body>
    </html>
  );
}
