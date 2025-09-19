import { notFound } from "next/navigation";
import ProductListClient from "@/components/ProductListClient";
import { productos } from "@/lib/products";

// Slugs válidos
const SLUGS = ["hogar","belleza","tecnologia","bienestar","eco","mascotas"] as const;
type Slug = typeof SLUGS[number];

// Normalizador fuerte (minúsculas, sin tildes, sin símbolos)
function normalize(raw: any): string {
  const s = String(raw ?? "")
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase().replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ").trim();

  // alias comunes -> slugs
  const map: Record<string, Slug> = {
    "hogar": "hogar",
    "casa": "hogar",
    "belleza": "belleza",
    "accesorios belleza": "belleza",
    "cuidado personal": "belleza",
    "tecnologia": "tecnologia",
    "tecnologica": "tecnologia",
    "tecnologia y gadgets": "tecnologia",
    "bienestar": "bienestar",
    "fitness": "bienestar",
    "deporte": "bienestar",
    "eco": "eco",
    "ecologia": "eco",
    "sustentable": "eco",
    "mascotas": "mascotas",
    "pet": "mascotas"
  };

  if (map[s as keyof typeof map]) return map[s as keyof typeof map];

  // contains heuristics
  if (s.includes("hogar") || s.includes("casa")) return "hogar";
  if (s.includes("belleza") || s.includes("cuidado")) return "belleza";
  if (s.includes("tecno") || s.includes("gadget")) return "tecnologia";
  if (s.includes("bienestar") || s.includes("fit") || s.includes("deporte")) return "bienestar";
  if (s.includes("eco") || s.includes("susten") || s.includes("verde")) return "eco";
  if (s.includes("mascota") || s.includes("pet")) return "mascotas";

  return s; // cae en bruto por si ya es slug
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string }}) {
  const slug = normalize(params.slug) as Slug;
  if (!SLUGS.includes(slug)) return notFound();

  // Filtro robusto: acepta 'Belleza', 'belleza', 'BELLEZA', 'cuidado personal', etc
  const lista = productos
    .filter((p: any) => normalize(p?.categoria) === slug)
    .slice(0, 12);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categoría: {slug}</h1>
      <ProductListClient items={lista} />
    </section>
  );
}
