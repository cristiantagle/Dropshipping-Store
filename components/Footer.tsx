import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold">Lunaria</h3>
          <p className="text-sm text-neutral-400 mt-2">
            Tu tienda online simple y bonita.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Categorías</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/categorias/hogar">Hogar</Link></li>
            <li><Link href="/categorias/belleza">Belleza</Link></li>
            <li><Link href="/categorias/tecnologia">Tecnología</Link></li>
            <li><Link href="/categorias/eco">Eco</Link></li>
            <li><Link href="/categorias/mascotas">Mascotas</Link></li>
            <li><Link href="/categorias/bienestar">Bienestar</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Sobre nosotros</a></li>
            <li><a href="#">Políticas</a></li>
            <li><a href="#">Soporte</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 text-center text-sm py-4">
        © {new Date().getFullYear()} Lunaria. Todos los derechos reservados.
      </div>
    </footer>
  );
}
