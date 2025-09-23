"use client";

import BackButton from "./BackButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container-lunaria h-14 flex items-center justify-between">
        {/* Izquierda: Volver + marca */}
        <div className="flex items-center gap-2">
          <BackButton className="btn px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700" />
          <Link href="/" className="ml-2 text-lg font-semibold tracking-tight text-gray-900 hover:opacity-90">
            Lunaria
          </Link>
        </div>

        {/* Centro: nav mínima */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className={`hover:text-emerald-700 ${pathname === "/" ? "text-emerald-700 font-medium" : "text-gray-600"}`}>
            Inicio
          </Link>
          <Link href="/categorias" className={`hover:text-emerald-700 ${pathname?.startsWith("/categorias") ? "text-emerald-700 font-medium" : "text-gray-600"}`}>
            Categorías
          </Link>
          <Link href="/carro" className={`hover:text-emerald-700 ${pathname === "/carro" ? "text-emerald-700 font-medium" : "text-gray-600"}`}>
            Carro
          </Link>
        </nav>

        {/* Derecha: CTA carro (FloatingCart flota aparte) */}
        <div className="w-[88px] md:w-[140px] flex justify-end">
          <Link href="/carro" className="btn bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5">
            Ver carro
          </Link>
        </div>
      </div>
    </header>
  );
}
