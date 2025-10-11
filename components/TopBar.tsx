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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo con ícono */}
        <Link href="/" className="flex items-center gap-3 text-xl font-bold text-lime-700 hover:text-lime-800 transition-all duration-300 transform hover:scale-105 group">
          <div className="relative">
            <Image
              src="/lunaria-icon.png" // o la URL de Supabase Storage si prefieres
              alt="Lunaria logo"
              width={32}
              height={32}
              className="rounded-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-sm"
            />
            <div className="absolute inset-0 bg-lime-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          </div>
          <span className="tracking-tight">Lunaria</span>
        </Link>

        {/* Buscador centrado en desktop */}
        <div className="hidden md:flex flex-1 justify-center mx-6">
          <SearchBar className="w-full max-w-md" />
        </div>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/categorias" className="relative px-3 py-2 rounded-lg hover:text-lime-700 hover:bg-lime-50/50 transition-all duration-300 group">
            <span className="relative z-10">Categorías</span>
            <div className="absolute inset-0 bg-gradient-to-r from-lime-500/0 via-lime-500/5 to-lime-500/0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
          </Link>
          <Link href="/buscar" className="relative px-3 py-2 rounded-lg hover:text-lime-700 hover:bg-lime-50/50 transition-all duration-300 group">
            <span className="relative z-10">Buscar</span>
            <div className="absolute inset-0 bg-gradient-to-r from-lime-500/0 via-lime-500/5 to-lime-500/0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
          </Link>
          <div 
            className="relative group"
            onMouseEnter={() => setShowMiniCart(true)}
            onMouseLeave={() => setShowMiniCart(false)}
          >
            <Link
              href="/carro"
              className="relative flex items-center px-3 py-2 rounded-lg hover:text-lime-700 hover:bg-lime-50/50 transition-all duration-300 group-hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="font-medium">Carrito</span>
              {isClient && totals.itemCount > 0 && (
                <span className={`
                  absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] flex items-center justify-center transition-all duration-300 shadow-lg
                  ${cartPulse ? 'animate-cartPulse scale-110' : 'scale-100'}
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
          className="md:hidden p-2.5 rounded-lg hover:bg-lime-50 hover:text-lime-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100/50 shadow-lg animate-slideIn">
          <nav className="flex flex-col p-6 gap-4 text-gray-700">
            <Link href="/categorias" className="py-3 px-4 rounded-lg hover:text-lime-700 hover:bg-lime-50/50 transition-all duration-300 font-medium">
              Categorías
            </Link>
            <Link href="/buscar" className="py-3 px-4 rounded-lg hover:text-lime-700 hover:bg-lime-50/50 transition-all duration-300 font-medium">
              Buscar
            </Link>
            <Link 
              href="/carro"
              className="py-3 px-4 rounded-lg hover:text-lime-700 hover:bg-lime-50/50 flex items-center transition-all duration-300 font-medium group"
            >
              <ShoppingCart className="w-5 h-5 mr-3 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
              Carrito
              {isClient && totals.itemCount > 0 && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full px-2.5 py-1 shadow-sm">
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
