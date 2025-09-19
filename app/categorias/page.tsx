import Link from "next/link";

const CATS = [
  { slug: "hogar", nombre: "Hogar", descripcion: "Productos para tu hogar" },
  { slug: "belleza", nombre: "Belleza", descripcion: "Cuidado personal" },
  { slug: "tecnologia", nombre: "Tecnología", descripcion: "Gadgets y más" },
  { slug: "bienestar", nombre: "Bienestar", descripcion: "Salud y fitness" },
  { slug: "eco", nombre: "Eco", descripcion: "Sostenibles" },
  { slug: "mascotas", nombre: "Mascotas", descripcion: "Para tus animales" },
];

export const dynamic = "force-static";
export const revalidate = 3600;

export default function CategoriasPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATS.map((c) => (
          <li key={c.slug} className="border rounded-2xl p-4 hover:bg-gray-50 transition">
            <h3 className="font-semibold">{c.nombre}</h3>
            <p className="text-sm text-gray-600">{c.descripcion}</p>
            <div className="mt-3">
              <Link
                href={`/categorias/${c.slug}`}
                className="inline-block text-sm px-3 py-1 rounded-md bg-black text-white"
              >
                Ver {c.nombre}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
