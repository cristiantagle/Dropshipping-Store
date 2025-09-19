import CategoryGrid from "@/components/CategoryGrid";

export const revalidate = 3600; // SSG con revalidación

export default function CategoriasPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <CategoryGrid />
    </section>
  );
}
