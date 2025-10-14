import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "@/lib/categorias";
import Breadcrumb from "@/components/Breadcrumb";
import { Home, Heart, Leaf, Users, PawPrint, Monitor, Briefcase, Shirt, User, ShoppingBag, Package } from "lucide-react";

// Iconos personalizados para categorías nuevas
const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, JSX.Element> = {
    hogar: <Home className="w-14 h-14 text-lime-600" />,
    belleza: <Heart className="w-14 h-14 text-pink-500" />,
    bienestar: <Users className="w-14 h-14 text-blue-500" />,
    eco: <Leaf className="w-14 h-14 text-green-500" />,
    mascotas: <PawPrint className="w-14 h-14 text-amber-500" />,
    oficina: <Briefcase className="w-14 h-14 text-gray-600" />,
    tecnologia: <Monitor className="w-14 h-14 text-indigo-500" />,
    ropa_hombre: <Shirt className="w-14 h-14 text-blue-600" />,
    ropa_mujer: <User className="w-14 h-14 text-pink-600" />,
    accesorios: <ShoppingBag className="w-14 h-14 text-purple-500" />,
    otros: <Package className="w-14 h-14 text-gray-500" />,
  };
  return iconMap[slug];
};

export default async function Categorias() {
  const categorias = getAllCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Categorías" }]} />

      {/* Hero de categorías */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900">
          Categorías
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Explora nuestras colecciones y encuentra productos que se adaptan a tu estilo de vida.
        </p>
      </div>

      {/* Grid de categorías */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categorias.map((c, index) => (
          <li key={`${c.slug}-${index}`}>
            <Link
              href={`/categorias/${c.slug}`}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-t-xl overflow-hidden">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {getCategoryIcon(c.slug) || (
                    <Image
                      src={c.image_url}
                      alt={c.nombre}
                      width={56}
                      height={56}
                      unoptimized
                      className="w-14 h-14 object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="text-base font-semibold text-gray-800 group-hover:text-lime-600 transition-colors">
                  {c.nombre}
                </div>
                <p className="text-sm text-gray-500 mt-1">Descubre más</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
