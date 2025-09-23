'use client';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-neutral-600">
            <strong className="font-semibold">Lunaria</strong> • Tienda simple y bonita
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <a className="hover:underline" href="/categorias">Categorías</a>
            <a className="hover:underline" href="/carro">Carro</a>
            <a className="hover:underline" href="/diag">Estado</a>
          </nav>
        </div>
        <div className="mt-4 text-xs text-neutral-500">© {year} Lunaria</div>
      </div>
    </footer>
  );
}
