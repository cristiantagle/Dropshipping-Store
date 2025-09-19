export type CategoriaSlug = "hogar" | "belleza" | "tecnologia" | "bienestar" | "eco" | "mascotas";

export const CATEGORIAS: { slug: CategoriaSlug; nombre: string; descripcion: string }[] = [
  { slug: "hogar",      nombre: "Hogar",      descripcion: "Organización y decoración inteligente" },
  { slug: "belleza",    nombre: "Belleza",    descripcion: "Cuidado personal y accesorios" },
  { slug: "tecnologia", nombre: "Tecnología", descripcion: "Gadgets útiles para el día a día" },
  { slug: "bienestar",  nombre: "Bienestar",  descripcion: "Fitness, descanso y salud" },
  { slug: "eco",        nombre: "Eco",        descripcion: "Productos sustentables" },
  { slug: "mascotas",   nombre: "Mascotas",   descripcion: "Accesorios y cuidado" },
];

// Normaliza entradas “no canónicas” por si productos usan nombres
const MAP_NOMBRE_A_SLUG: Record<string, CategoriaSlug> = {
  "Hogar": "hogar",
  "Belleza": "belleza",
  "Tecnología": "tecnologia",
  "Tecnologia": "tecnologia",
  "Bienestar": "bienestar",
  "Eco": "eco",
  "Mascotas": "mascotas",
};

export function normalizaCategoria(valor?: string): CategoriaSlug | undefined {
  if (!valor) return undefined;
  const v = valor.trim().toLowerCase();
  const direct = ["hogar","belleza","tecnologia","bienestar","eco","mascotas"] as const;
  if ((direct as readonly string[]).includes(v)) return v as CategoriaSlug;
  const porNombre = MAP_NOMBRE_A_SLUG[valor] || MAP_NOMBRE_A_SLUG[valor.normalize()];
  return porNombre;
}

export function getCategoriaBySlug(slug: string) {
  return CATEGORIAS.find(c => c.slug === slug);
}

export function getAllCategorySlugs(): CategoriaSlug[] {
  return CATEGORIAS.map(c => c.slug);
}
