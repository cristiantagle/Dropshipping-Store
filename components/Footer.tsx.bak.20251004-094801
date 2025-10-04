'use client';
import Link from "next/link";

export default function Footer(){
  return (
    <footer className="mt-16 border-t bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <div className="size-8 rounded-lg bg-lime-600 text-white grid place-items-center shadow-sm">
              <span className="font-black">L</span>
            </div>
            <span className="font-extrabold tracking-tight">Lunaria</span>
          </div>
          <p className="mt-3 text-sm text-neutral-600">Cosas útiles y bonitas. Envíos simples.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Tienda</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li><Link className="hover:underline" href="/categorias">Categorías</Link></li>
            <li><a className="hover:underline" href="#">Novedades</a></li>
            <li><a className="hover:underline" href="#">Ofertas</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Soporte</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li><a className="hover:underline" href="#">Contacto</a></li>
            <li><a className="hover:underline" href="#">Envíos y devoluciones</a></li>
            <li><a className="hover:underline" href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li><a className="hover:underline" href="#">Términos</a></li>
            <li><a className="hover:underline" href="#">Privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-neutral-500">
          © <span>{new Date().getFullYear()}</span> Lunaria — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
