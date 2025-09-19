// lib/categorias.ts
export type CategoriaSlug =
  | "hogar"
  | "belleza"
  | "tecnologia"
  | "bienestar"
  | "eco"
  | "mascotas";

export type CategoriaNombre =
  | "Hogar"
  | "Belleza"
  | "Tecnología"
  | "Bienestar"
  | "Eco"
  | "Mascotas";

export interface Categoria {
  slug: CategoriaSlug;
  nombre: CategoriaNombre;
}

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar: { slug: "hogar", nombre: "Hogar" },
  belleza: { slug: "belleza", nombre: "Belleza" },
  tecnologia: { slug: "tecnologia", nombre: "Tecnología" },
  bienestar: { slug: "bienestar", nombre: "Bienestar" },
  eco: { slug: "eco", nombre: "Eco" },
  mascotas: { slug: "mascotas", nombre: "Mascotas" },
};

// Normaliza string a slug CategoriaSlug si coincide, o null si no.
export function toSlug(raw: string | undefined | null): CategoriaSlug | null {
  if (!raw) return null;
  const s = raw
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

  const map: Record<string, CategoriaSlug> = {
    "hogar": "hogar",
    "casa": "hogar",
    "home": "hogar",

    "belleza": "belleza",
    "accesorios belleza": "belleza",
    "cuidado personal": "belleza",

    "tecnologia": "tecnologia",
    "tecnología": "tecnologia",
    "electronica": "tecnologia",
    "electrónica": "tecnologia",
    "gadgets": "tecnologia",

    "bienestar": "bienestar",
    "fitness": "bienestar",
    "salud": "bienestar",

    "eco": "eco",
    "ecologico": "eco",
    "ecológico": "eco",
    "sustentable": "eco",

    "mascotas": "mascotas",
    "pet": "mascotas",
    "perros": "mascotas",
    "gatos": "mascotas",
  };

  // Si ya es un slug exacto:
  if ((Object.keys(CATEGORIAS) as CategoriaSlug[]).includes(s as CategoriaSlug)) {
    return s as CategoriaSlug;
  }

  // Búsqueda por nombre exacto (sin tildes) o alias del mapa
  return map[s] ?? null;
}

export function getCategoriaBySlug(slug: string): Categoria | null {
  const s = toSlug(slug);
  return s ? CATEGORIAS[s] : null;
}

export function listCategorias(): Categoria[] {
  return (Object.keys(CATEGORIAS) as CategoriaSlug[]).map((k) => CATEGORIAS[k]);
}
