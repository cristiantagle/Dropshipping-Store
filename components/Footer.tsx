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
