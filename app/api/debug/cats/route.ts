import { NextResponse } from "next/server";
import { productos } from "@/lib/products";

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

export async function GET() {
  const counts: Record<Slug, number> = { hogar:0,belleza:0,tecnologia:0,bienestar:0,eco:0,mascotas:0 };
  const sample: Record<Slug, any[]> = { hogar:[],belleza:[],tecnologia:[],bienestar:[],eco:[],mascotas:[] };

  for (const p of productos as any[]) {
    const slug = normalize(p?.categoria) as Slug;
    if ((["hogar","belleza","tecnologia","bienestar","eco","mascotas"] as string[]).includes(slug)) {
      counts[slug as Slug] += 1;
      if (sample[slug as Slug].length < 3) {
        sample[slug as Slug].push({
          id: String(p?.id ?? ""),
          nombre: String(p?.nombre ?? ""),
          categoriaRaw: p?.categoria,
          categoriaNorm: slug,
          imagen: p?.imagen ?? null,
          precio: p?.precio ?? null,
        });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    total: (productos as any[]).length,
    counts,
    sample,
  });
}
