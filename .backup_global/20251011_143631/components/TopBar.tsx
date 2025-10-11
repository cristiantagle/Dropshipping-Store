"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useOptimizedCart } from '@/contexts/OptimizedCartContext';
import MiniCart from './MiniCart';

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { totals } = useOptimizedCart();

  // Fix hydration by ensuring client-side only rendering of cart count
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animate cart counter when totalItems changes
  useEffect(() => {
    if (isClient && totals.itemCount > 0) {
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isClient, totals.itemCount]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo con ícono */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-lime-700">
          <Image
            src="/lunaria-icon.png" // o la URL de Supabase Storage si prefieres
            alt="Lunaria logo"
            width={28}
            height={28}
            className="rounded"
          />
          Lunaria
        </Link>

        {/* Buscador centrado en desktop */}
        <div className="hidden md:flex flex-1 justify-center mx-6">
          <SearchBar className="w-full max-w-md" />
        </div>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/categorias" className="hover:text-lime-700">
            Categorías
          </Link>
          <Link href="/buscar" className="hover:text-lime-700">
            Buscar
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => setShowMiniCart(true)}
            onMouseLeave={() => setShowMiniCart(false)}
          >
            <Link
              href="/carro"
              className="relative flex items-center hover:text-lime-700 transition-colors"
            >
            <ShoppingCart className="w-5 h-5 mr-1" />
            Carrito
              {isClient && totals.itemCount > 0 && (
                <span className={`
                  absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center transition-all duration-200
                  ${cartPulse ? 'animate-cartPulse' : ''}
                `}>
                  {totals.itemCount > 99 ? '99+' : totals.itemCount}
                </span>
              )}
            </Link>
            
            {/* Mini Cart Preview */}
            <MiniCart isVisible={showMiniCart} />
          </div>
        </nav>

        {/* Botón menú móvil */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <nav className="flex flex-col p-4 gap-4 text-gray-700">
            <Link href="/categorias" className="hover:text-lime-700">
              Categorías
            </Link>
            <Link href="/buscar" className="hover:text-lime-700">
              Buscar
            </Link>
            <Link 
              href="/carro"
              className="hover:text-lime-700 flex items-center transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrito
              {isClient && totals.itemCount > 0 && (
                <span className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full px-2 py-1">
                  {totals.itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
