import BackButton from "@/components/BackButton";
import CategoryGrid from "@/components/CategoryGrid";

export const metadata = { title: "Categorías" };

export default function CategoriasPage() {
  return (
    <main className="space-y-8">
      <header className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-lime-50 to-white border border-lime-100 lnr-appear">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Categorías</h1>
<div className="back-row"><BackButton /></div>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Encuentra rápido lo que buscas: selecciona una categoría y explora nuestros productos.
        </p>
      </header>
      <CategoryGrid />
    </main>
  );
}
