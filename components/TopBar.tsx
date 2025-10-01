'use client';

import Link from "next/link";
import SearchBar from "./SearchBar";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-lime-700">
          Lunaria
        </Link>

        {/* Buscador */}
        <SearchBar className="hidden md:flex" />

        {/* Navegación */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/categorias" className="hover:text-lime-700">Categorías</Link>
          <Link href="/carro" className="hover:text-lime-700">Carrito</Link>
          <Link href="/diag" className="hover:text-lime-700">Diag</Link>
        </nav>
      </div>
    </header>
  );
}
