import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/lib/categorias';
import Breadcrumb from '@/components/Breadcrumb';
import {
  Home,
  Heart,
  Leaf,
  Users,
  PawPrint,
  Monitor,
  Briefcase,
  Shirt,
  User,
  ShoppingBag,
  Package,
} from 'lucide-react';
import type { ReactNode } from 'react';

// Iconos personalizados para categorías nuevas
const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, ReactNode> = {
    hogar: <Home className="h-14 w-14 text-lime-600" />,
    belleza: <Heart className="h-14 w-14 text-pink-500" />,
    bienestar: <Users className="h-14 w-14 text-blue-500" />,
    eco: <Leaf className="h-14 w-14 text-green-500" />,
    mascotas: <PawPrint className="h-14 w-14 text-amber-500" />,
    oficina: <Briefcase className="h-14 w-14 text-gray-600" />,
    tecnologia: <Monitor className="h-14 w-14 text-indigo-500" />,
    ropa_hombre: <Shirt className="h-14 w-14 text-blue-600" />,
    ropa_mujer: <User className="h-14 w-14 text-pink-600" />,
    accesorios: <ShoppingBag className="h-14 w-14 text-purple-500" />,
    otros: <Package className="h-14 w-14 text-gray-500" />,
  };
  return iconMap[slug];
};

export default async function Categorias() {
  const categorias = getAllCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Categorías' }]} />

      {/* Hero de categorías */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900">Categorías</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Explora nuestras colecciones y encuentra productos que se adaptan a tu estilo de vida.
        </p>
      </div>

      {/* Grid de categorías */}
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {categorias.map((c, index) => (
          <li key={`${c.slug}-${index}`}>
            <Link
              href={`/categorias/${c.slug}`}
              className="group block rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-xl bg-gray-50">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {getCategoryIcon(c.slug) || (
                    <Image
                      src={c.image_url}
                      alt={c.nombre}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="text-base font-semibold text-gray-800 transition-colors group-hover:text-lime-600">
                  {c.nombre}
                </div>
                <p className="mt-1 text-sm text-gray-500">Descubre más</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
