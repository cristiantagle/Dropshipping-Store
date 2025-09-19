import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos } from "@/lib/products";

export const dynamic = "force-static";

const SLUGS = ["hogar","belleza","tecnologia","bienestar","eco","mascotas"] as const;
type Slug = typeof SLUGS[number];

function normalize(raw: any): string {
  const s = String(raw ?? "")
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase().replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ").trim();

  if (s.includes("hogar") || s.includes("casa")) return "hogar";
  if (s.includes("belleza") || s.includes("cuidado")) return "belleza";
  if (s.includes("tecno") || s.includes("gadget")) return "tecnologia";
  if (s.includes("bienestar") || s.includes("fit") || s.includes("deporte")) return "bienestar";
  if (s.includes("eco") || s.includes("susten") || s.includes("verde")) return "eco";
  if (s.includes("mascota") || s.includes("pet")) return "mascotas";
  return s;
}

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string }}) {
  const slug = normalize(params.slug) as Slug;
  if (!SLUGS.includes(slug)) return notFound();

  // Importante: aceptar datasets con categoria = "Belleza" o "belleza"
  const listaBase = (productos as any[]).filter((p) => normalize(p?.categoria) === slug);

  // Garantizar hasta 12
  const lista = listaBase.slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {slug}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
