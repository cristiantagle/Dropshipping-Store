export type CategoriaSlug = "hogar" | "belleza" | "tecnologia" | "bienestar" | "eco" | "mascotas";

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  descripcion?: string;
}

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar:      { slug: "hogar",      nombre: "Hogar",      descripcion: "Productos para el hogar" },
  belleza:    { slug: "belleza",    nombre: "Belleza",    descripcion: "Belleza y cuidado personal" },
  tecnologia: { slug: "tecnologia", nombre: "Tecnología", descripcion: "Gadgets y accesorios tech" },
  bienestar:  { slug: "bienestar",  nombre: "Bienestar",  descripcion: "Salud y fitness" },
  eco:        { slug: "eco",        nombre: "Eco",        descripcion: "Sustentable y reutilizable" },
  mascotas:   { slug: "mascotas",   nombre: "Mascotas",   descripcion: "Para tus mascotas" },
};

export function normalizaCategoria(v: string): CategoriaSlug | null {
  const t = v.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().trim();
  if (t.includes("hogar")) return "hogar";
  if (t.includes("belleza")) return "belleza";
  if (t.includes("tecno")) return "tecnologia";
  if (t.includes("bienestar") || t.includes("fitness") || t.includes("salud")) return "bienestar";
  if (t.includes("eco") || t.includes("sustent") || t.includes("reutil")) return "eco";
  if (t.includes("mascota") || t.includes("pet")) return "mascotas";
  // también aceptar exactamente los slugs
  if (["hogar","belleza","tecnologia","bienestar","eco","mascotas"].includes(t)) return t as CategoriaSlug;
  return null;
}

export function getCategoriaBySlug(slug: string): Categoria | null {
  const s = normalizaCategoria(slug);
  return s ? CATEGORIAS[s] : null;
}

export function getAllCategorySlugs(): CategoriaSlug[] {
  return Object.keys(CATEGORIAS) as CategoriaSlug[];
}

export function listCategorias(): Categoria[] {
  return Object.values(CATEGORIAS);
}
