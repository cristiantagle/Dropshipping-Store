'use client';
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white/80 backdrop-blur-md text-sm text-neutral-700">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-3 transition hover:-translate-y-1 hover:shadow-lg">
            <Image
              src="/lunaria-icon.png"
              alt="Lunaria"
              width={32}
              height={32}
              className="rounded-lg shadow-md"
            />
            <span className="font-display font-bold tracking-tight text-lg text-lime-700">Lunaria</span>
          </div>
          <p className="text-neutral-600 leading-relaxed">Cosas útiles y bonitas. Envíos simples.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Tienda</h4>
          <ul className="space-y-1">
            <li><Link className="hover:text-lime-700 transition" href="/categorias">Categorías</Link></li>
            <li><a className="hover:text-lime-700 transition" href="#">Novedades</a></li>
            <li><a className="hover:text-lime-700 transition" href="#">Ofertas</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Soporte</h4>
          <ul className="space-y-1">
            <li><a className="hover:text-lime-700 transition" href="#">Contacto</a></li>
            <li><a className="hover:text-lime-700 transition" href="#">Envíos y devoluciones</a></li>
            <li><a className="hover:text-lime-700 transition" href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Contacto</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-neutral-700">
              <Mail className="w-4 h-4 text-lime-600" />
              <a href="mailto:soporte@lunaria.cl" className="hover:text-lime-700 transition">soporte@lunaria.cl</a>
            </li>
            <li className="flex items-center gap-2 text-neutral-700">
              <Phone className="w-4 h-4 text-lime-600" />
              <span>+56 9 1234 5678</span>
            </li>
            <li className="flex gap-4 mt-2">
              <a href="#" className="text-neutral-500 hover:text-lime-600 transition"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-neutral-500 hover:text-lime-600 transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-neutral-500 hover:text-lime-600 transition"><Twitter className="w-5 h-5" /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-neutral-500 text-center">
          © <span>{new Date().getFullYear()}</span> Lunaria — E-commerce sustentable. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
