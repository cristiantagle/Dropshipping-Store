"use client";

const categorias = [
  { nombre: "Belleza", icono: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/belleza.svg" },
  { nombre: "Bienestar", icono: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/bienestar.svg" },
  { nombre: "Eco", icono: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/eco.svg" },
  { nombre: "Hogar", icono: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/hogar.svg" },
  { nombre: "Mascotas", icono: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/mascotas.svg" },
  { nombre: "Oficina", icono: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/oficina.svg" },
  { nombre: "Tecnología", icono: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/tecnologia.svg" },
];

export default function Categorias() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {categorias.map((cat) => (
            <div key={cat.nombre} className="flex flex-col items-center text-center group">
              <img
                src={cat.icono}
                alt={cat.nombre}
                className="w-16 h-16 mb-4 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-lg font-medium text-gray-700">{cat.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
