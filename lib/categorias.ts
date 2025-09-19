export type CategoriaSlug = "hogar" | "belleza" | "tecnologia" | "bienestar" | "eco" | "mascotas";

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
}

export const CATEGORIAS: Categoria[] = [
  { slug: "hogar",      nombre: "Hogar" },
  { slug: "belleza",    nombre: "Belleza" },
  { slug: "tecnologia", nombre: "Tecnología" },
  { slug: "bienestar",  nombre: "Bienestar" },
  { slug: "eco",        nombre: "Eco" },
  { slug: "mascotas",   nombre: "Mascotas" },
];

export function getCategoriaBySlug(slug: string): Categoria | null {
  const s = slug.toLowerCase() as CategoriaSlug;
  return (CATEGORIAS.find(c => c.slug === s) ?? null);
}
