import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { OptimizedCartProvider } from "../contexts/OptimizedCartContext";
import { ToastProvider } from "../contexts/ToastContext";
import { WishlistProvider } from "../contexts/WishlistContext";
import { RecentlyViewedProvider } from "../contexts/RecentlyViewedContext";
import FloatingCart from "@/components/FloatingCart";
import { AuthProvider } from "@/contexts/AuthContext";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-poppins" });
export const metadata = {
  title: "Lunaria",
  description: "Cosas Ãºtiles y bonitas. E-commerce sustentable con envÃ­os simples.",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="Content-Language" content="es" />
        <meta name="description" content="Descubre productos Ãºtiles, bonitos y sustentables en Lunaria. EnvÃ­os simples, calidad real." />
      </head>
      <body className={`font-sans bg-gray-50 text-gray-900 antialiased overflow-x-hidden ${inter.variable} ${poppins.variable}`}>
        <ToastProvider>
          <RecentlyViewedProvider>
            <WishlistProvider>
              <OptimizedCartProvider>
                <AuthProvider>
                  <TopBar />
                  {children}
                  <Footer />
                  <FloatingCart />
                </AuthProvider>
              </OptimizedCartProvider>
            </WishlistProvider>
          </RecentlyViewedProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

