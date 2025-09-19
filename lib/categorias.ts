export type CategoriaSlug = 'hogar' | 'belleza' | 'tecnologia' | 'bienestar' | 'eco' | 'mascotas';

export type Categoria = {
  slug: CategoriaSlug;
  nombre: 'Hogar' | 'Belleza' | 'Tecnología' | 'Bienestar' | 'Eco' | 'Mascotas';
  descripcion: string;
};

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar:      { slug: 'hogar',      nombre: 'Hogar',      descripcion: 'Organización y accesorios para tu casa.' },
  belleza:    { slug: 'belleza',    nombre: 'Belleza',    descripcion: 'Cuidado personal, peinado y makeup.' },
  tecnologia: { slug: 'tecnologia', nombre: 'Tecnología', descripcion: 'Gadgets y accesorios prácticos.' },
  bienestar:  { slug: 'bienestar',  nombre: 'Bienestar',  descripcion: 'Fitness, relajación y salud.' },
  eco:        { slug: 'eco',        nombre: 'Eco',        descripcion: 'Productos reutilizables y sostenibles.' },
  mascotas:   { slug: 'mascotas',   nombre: 'Mascotas',   descripcion: 'Para tu perro o gato: juego y cuidado.' },
};

/** Lista de categorías en array (para mapear en UI). */
export function listCategorias(): Categoria[] {
  return Object.values(CATEGORIAS);
}

/** Normaliza string a CategoriaSlug o null si no corresponde. */
export function toCategoriaSlug(s: string): CategoriaSlug | null {
  const k = (s || '').toLowerCase() as CategoriaSlug;
  return (k && k in CATEGORIAS) ? k : null;
}

/** Alias requerido por page.tsx existente. */
export function normalizaCategoria(s: string): CategoriaSlug | null {
  return toCategoriaSlug(s);
}

/** Obtiene la categoría por slug; si no existe, null. */
export function getCategoriaBySlug(slug: string): Categoria | null {
  const k = toCategoriaSlug(slug);
  return k ? CATEGORIAS[k] : null;
}

/** Slugs disponibles (para generateStaticParams o validación). */
export function getAllCategorySlugs(): CategoriaSlug[] {
  return Object.keys(CATEGORIAS) as CategoriaSlug[];
}
