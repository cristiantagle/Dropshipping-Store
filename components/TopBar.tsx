// components/TopBar.tsx
'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Grid3X3 } from "lucide-react";

export default function TopBar() {
  const router = useRouter();
  return (
    <div className="fixed inset-x-0 top-0 z-[60]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-4 rounded-2xl bg-emerald-600/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-600/85 shadow-lg ring-1 ring-black/5">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Izquierda: Volver */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white hover:bg-white/15 active:scale-[0.98] transition"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>

            {/* Centro: Logo / Marca */}
            <Link
              href="/"
              className="select-none font-semibold tracking-tight text-white text-base sm:text-lg md:text-xl hover:opacity-95 transition"
            >
              Lunaria
            </Link>

            {/* Derecha: Explorar categorías */}
            <Link
              href="/categorias"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-emerald-700 hover:bg-emerald-50 shadow-sm transition"
            >
              <Grid3X3 className="h-5 w-5" />
              <span className="hidden sm:inline">Explorar categorías</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
