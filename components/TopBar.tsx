"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useCart } from '../contexts/CartContext';
import ShoppingCartModal from './ShoppingCart';

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

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
          <Link href="/diag" className="hover:text-lime-700">
            Diag
          </Link>
          <button
            onClick={toggleCart}
            className="relative flex items-center hover:text-lime-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 mr-1" />
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
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
            <Link href="/diag" className="hover:text-lime-700">
              Diag
            </Link>
            <button 
              onClick={toggleCart}
              className="hover:text-lime-700 flex items-center transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrito
              {totalItems > 0 && (
                <span className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full px-2 py-1">
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      )}
      
      {/* Shopping Cart Modal */}
      <ShoppingCartModal />
    </header>
  );
}
