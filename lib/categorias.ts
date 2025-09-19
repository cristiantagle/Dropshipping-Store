export type CategoriaSlug = "hogar" | "belleza" | "tecnologia" | "bienestar" | "eco" | "mascotas";

export type Categoria = {
  slug: CategoriaSlug;
  nombre: string;
  descripcion: string;
};

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar: { slug: "hogar", nombre: "Hogar", descripcion: "Organización, decoración y más" },
  belleza: { slug: "belleza", nombre: "Belleza", descripcion: "Cuidado personal y accesorios" },
  tecnologia: { slug: "tecnologia", nombre: "Tecnología", descripcion: "Gadgets y accesorios tech" },
  bienestar: { slug: "bienestar", nombre: "Bienestar", descripcion: "Fitness y vida saludable" },
  eco: { slug: "eco", nombre: "Eco", descripcion: "Productos sustentables" },
  mascotas: { slug: "mascotas", nombre: "Mascotas", descripcion: "Accesorios y cuidado" },
};

export function listCategorias(): Categoria[] {
  return Object.values(CATEGORIAS);
}

export function getCategoriaBySlug(slug: string | undefined | null): Categoria | null {
  if (!slug) return null;
  const s = slug.toLowerCase() as CategoriaSlug;
  return (CATEGORIAS as any)[s] || null;
}

export function getAllCategorySlugs(): CategoriaSlug[] {
  return Object.keys(CATEGORIAS) as CategoriaSlug[];
}

// Normalizador simple (por si vienen nombres con acentos o mayúsculas)
export function normalizaCategoria(input: string): CategoriaSlug | null {
  if (!input) return null;
  const s = input.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const map: Record<string, CategoriaSlug> = {
    hogar: "hogar",
    belleza: "belleza",
    tecnologia: "tecnologia",
    tecnologIa: "tecnologia",
    bienestar: "bienestar",
    eco: "eco",
    mascotas: "mascotas",
  };
  return map[s] ?? null;
}
