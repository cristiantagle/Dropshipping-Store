export type CategoriaSlug = 'hogar' | 'belleza' | 'tecnologia' | 'bienestar' | 'eco' | 'mascotas';
export type Categoria = { slug: CategoriaSlug; nombre: string; descripcion: string };

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar: { slug: 'hogar', nombre: 'Hogar', descripcion: 'Organiza y decora tu casa.' },
  belleza: { slug: 'belleza', nombre: 'Belleza', descripcion: 'Cuidado personal y accesorios.' },
  tecnologia: { slug: 'tecnologia', nombre: 'Tecnología', descripcion: 'Gadgets y accesorios tech.' },
  bienestar: { slug: 'bienestar', nombre: 'Bienestar', descripcion: 'Salud, fitness y relax.' },
  eco: { slug: 'eco', nombre: 'Eco', descripcion: 'Productos sustentables.' },
  mascotas: { slug: 'mascotas', nombre: 'Mascotas', descripcion: 'Para tus compañeros peludos.' },
};

/** Devuelve la lista de categorías como array (para mapear en UI). */
export function listCategorias(): Categoria[] {
  return Object.values(CATEGORIAS);
}

/** Slugs disponibles (para SSG). */
export function getAllCategorySlugs(): CategoriaSlug[] {
  return Object.keys(CATEGORIAS) as CategoriaSlug[];
}

/** Busca categoría por slug (case-insensitive). */
export function getCategoriaBySlug(slug: string): Categoria | null {
  const s = slug.toLowerCase() as CategoriaSlug;
  return (CATEGORIAS as any)[s] ?? null;
}

/** Normaliza nombres humanos a slugs (por si se usa en el futuro). */
export function normalizaCategoria(input: string): CategoriaSlug | null {
  const s = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const map: Record<string, CategoriaSlug> = {
    hogar: 'hogar',
    belleza: 'belleza',
    tecnologia: 'tecnologia',
    bienestar: 'bienestar',
    eco: 'eco',
    mascotas: 'mascotas',
  };
  return map[s] ?? null;
}
