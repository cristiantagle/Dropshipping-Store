#!/usr/bin/env bash
set -euo pipefail

BR="preview/lookfeel-polish-$(date +%Y%m%d-%H%M%S)"
echo "🎨 Look&Feel polish (TopBar activo + Footer + ClientShell ordenado)"
echo "🌱 Rama: $BR"

# Aseguramos estado limpio y base en origin/main
git fetch origin --prune
git checkout -B "$BR" origin/main

# --- 1) TopBar: resaltar link activo "Categorías" ---
cat > components/TopBar.tsx.bak <<'EOF'
$(cat components/TopBar.tsx)
EOF

cat > components/TopBar.tsx <<'EOF'
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
EOF

# --- 2) Footer minimal consistente ---
cat > components/Footer.tsx <<'EOF'
export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-neutral-600">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-lime-600 text-white grid place-items-center shadow-sm">
              <span className="font-black">L</span>
            </div>
            <span className="font-semibold text-neutral-800">Lunaria</span>
          </div>
          <nav className="flex items-center gap-4 text-neutral-600">
            <a href="/categorias" className="hover:text-neutral-900 transition">Categorías</a>
            <a href="/carro" className="hover:text-neutral-900 transition">Carro</a>
            <a href="/diag" className="hover:text-neutral-900 transition">Diag</a>
          </nav>
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          © {new Date().getFullYear()} Lunaria. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
EOF

# --- 3) ClientShell: orquesta TopBar + content + FloatingCart + BackToTopGuard + PreviewBadge + Footer ---
cat > components/ClientShell.tsx.bak <<'EOF'
$(cat components/ClientShell.tsx)
EOF

cat > components/ClientShell.tsx <<'EOF'
'use client';
import TopBar from "@/components/TopBar";
import FloatingCart from "@/components/FloatingCart";
import BackToTopGuard from "@/components/BackToTopGuard";
import PreviewBadge from "@/components/PreviewBadge";
import Footer from "@/components/Footer";
import React from "react";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackToTopGuard />
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {children}
      </main>
      <Footer />
      <FloatingCart />
      <PreviewBadge />
    </>
  );
}
EOF

# --- 4) Asegurar import en layout (ya existente) se mantiene minimal ---
# (No tocamos app/layout.tsx: ya envuelve con ClientShell y define Inter+html/body.)

# --- 5) Commit y push preview ---
git add -A
if ! git diff --cached --quiet; then
  git commit -m "feat(ui): TopBar activo + Footer consistente + ClientShell ordenado (sin tocar lógica)"
else
  echo "ℹ️ No hay cambios para commitear (¿ya estaban aplicados?)."
fi

git push -u origin "$BR"

echo
echo "✅ Rama subida: $BR"
echo "➡ Revisa el preview en Vercel. Cuando digas 'LUNARIA ok', te doy el script de merge."
