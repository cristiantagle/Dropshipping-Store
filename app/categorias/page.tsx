import { categorias } from "@/lib/categorias";

export default function CategoriasPage() {
  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categorias.map((cat) => (
          <div key={cat.nombre} className="flex flex-col items-center text-center">
            <img src={cat.icon} alt={cat.nombre} className="w-12 h-12 mb-2" />
            <span className="text-sm font-medium">{cat.nombre}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
