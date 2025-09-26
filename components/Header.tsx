import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black text-white">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logos/lunaria-full.svg"
          alt="Lunaria"
          width={160}
          height={40}
          className="hidden md:block"
        />
        <Image
          src="/logos/lunaria-icon.svg"
          alt="Lunaria"
          width={40}
          height={40}
          className="md:hidden"
        />
      </Link>
      <nav className="space-x-4">
        <Link href="/categorias">Categorías</Link>
        <Link href="/carrito">Carrito</Link>
      </nav>
    </header>
  );
}
