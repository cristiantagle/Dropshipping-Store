export type CategoriaSlug = 'hogar' | 'belleza' | 'tecnologia' | 'bienestar' | 'eco' | 'mascotas';

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  descripcion: string;
}

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar:      { slug: 'hogar',      nombre: 'Hogar',      descripcion: 'Organiza y decora tu espacio.' },
  belleza:    { slug: 'belleza',    nombre: 'Belleza',    descripcion: 'Cuidado personal y accesorios.' },
  tecnologia: { slug: 'tecnologia', nombre: 'Tecnología', descripcion: 'Gadgets y accesorios tech.' },
  bienestar:  { slug: 'bienestar',  nombre: 'Bienestar',  descripcion: 'Salud física y mental.' },
  eco:        { slug: 'eco',        nombre: 'Eco',        descripcion: 'Productos sostenibles y eco.' },
  mascotas:   { slug: 'mascotas',   nombre: 'Mascotas',   descripcion: 'Mimos y accesorios peludos.' },
};

export function listCategorias(): Categoria[] {
  return Object.values(CATEGORIAS);
}

export function getAllCategorySlugs(): CategoriaSlug[] {
  return Object.keys(CATEGORIAS) as CategoriaSlug[];
}

export function getCategoriaBySlug(slug: string | undefined | null): Categoria | null {
  const s = normalizaCategoria(slug ?? '');
  return s ? CATEGORIAS[s] : null;
}

export function normalizaCategoria(raw: string): CategoriaSlug | null {
  const s = (raw || '').trim().toLowerCase();
  if (!s) return null;
  const map: Record<string, CategoriaSlug> = {
    hogar: 'hogar', casa: 'hogar',
    belleza: 'belleza',
    tecnologia: 'tecnologia', tecnológico: 'tecnologia', 'tecnología': 'tecnologia',
    bienestar: 'bienestar', fitness: 'bienestar', salud: 'bienestar',
    eco: 'eco', ecológico: 'eco', 'eco-friendly': 'eco',
    mascotas: 'mascotas', pets: 'mascotas'
  };
  return (map[s] ?? (Object.keys(CATEGORIAS).includes(s) ? (s as CategoriaSlug) : null));
}
