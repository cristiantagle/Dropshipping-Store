'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  const catActive = pathname?.startsWith("/categorias");

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-3">
            {/* Left: Back (si existe BackNav/BackButton lo puedes poner aquí luego) */}
            <div className="min-w-0" />

            {/* Center: Logo + nombre */}
            <Link href="/" className="shrink-0 inline-flex items-center gap-2 group">
              <div className="size-8 rounded-lg bg-lime-600 text-white grid place-items-center shadow-sm group-hover:scale-[1.03] transition">
                <span className="font-black">L</span>
              </div>
              <div className="leading-tight">
                <div className="font-extrabold tracking-tight">Lunaria</div>
                <div className="text-xs text-neutral-500 -mt-0.5">Tienda simple y bonita</div>
              </div>
            </Link>

            {/* Right: Nav mínima */}
            <nav className="flex items-center gap-1.5">
              <Link
                href="/categorias"
                aria-current={catActive ? "page" : undefined}
                className={[
                  "inline-flex rounded-xl px-3 py-2 text-sm font-semibold transition",
                  catActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-800 hover:bg-neutral-100"
                ].join(" ")}
              >
                Categorías
              </Link>
              <button
                type="button"
                onClick={() => alert('Pronto: login/usuario')}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-white/60 transition"
                aria-label="Iniciar sesión"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM3 22a9 9 0 1118 0" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">Entrar</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
      {/* Spacer para que el contenido no quede bajo la barra */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
