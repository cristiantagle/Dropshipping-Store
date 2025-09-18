import { Suspense } from "react";
import CategoriasClient from "@/components/CategoriasClient";
import { categorias } from "@/lib/catalogo";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Categorías — Lunaria",
  description: "Explora las categorías y descubre nuestros productos."
};

export default function CategoriasPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Cargando categorías…</div>}>
      <CategoriasClient />
    </Suspense>
  );
}
