export type CategoriaSlug = "belleza" | "hogar" | "tecnologia" | "bienestar" | "eco" | "mascotas";

export type Categoria = {
  slug: CategoriaSlug;
  nombre: string;
  descripcion?: string;
};

export const CATEGORIAS: Categoria[] = [
  { slug: "belleza",   nombre: "Belleza",   descripcion: "Accesorios y organización de belleza." },
  { slug: "hogar",     nombre: "Hogar",     descripcion: "Orden y equipamiento para tu casa." },
  { slug: "tecnologia",nombre: "Tecnología",descripcion: "Accesorios y soporte para tus dispositivos." },
  { slug: "bienestar", nombre: "Bienestar", descripcion: "Fitness y cuidado personal." },
  { slug: "eco",       nombre: "Eco",       descripcion: "Productos sustentables y reutilizables." },
  { slug: "mascotas",  nombre: "Mascotas",  descripcion: "Cuidado y accesorios para tus mascotas." },
];

// Elimina tildes/diacríticos y pasa a minúsculas
function normalizeBase(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Diccionario de variantes de nombre → slug
const NOMBRE_A_SLUG: Record<string, CategoriaSlug> = {
  // Belleza
  "belleza": "belleza",
  "accesorios belleza": "belleza",
  "belleza accesorios": "belleza",
  "belleza & cuidado": "belleza",

  // Hogar
  "hogar": "hogar",
  "casa": "hogar",
  "orden hogar": "hogar",

  // Tecnología
  "tecnologia": "tecnologia",
  "tecnología": "tecnologia",
  "tech": "tecnologia",

  // Bienestar
  "bienestar": "bienestar",
  "fitness": "bienestar",

  // Eco
  "eco": "eco",
  "sustentable": "eco",

  // Mascotas
  "mascotas": "mascotas",
  "pet": "mascotas",
};

export function nombreToSlug(nombre: string | undefined | null): CategoriaSlug | undefined {
  if (!nombre) return undefined;
  const key = normalizeBase(String(nombre));
  return NOMBRE_A_SLUG[key];
}

export function getCategoriaBySlug(slug: string) {
  return CATEGORIAS.find(c => c.slug === slug);
}
