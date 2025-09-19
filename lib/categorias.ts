export type CategoriaSlug = 'hogar' | 'belleza' | 'tecnologia' | 'bienestar' | 'eco' | 'mascotas';

export interface Categoria {
  slug: CategoriaSlug;
  nombre: 'Hogar' | 'Belleza' | 'Tecnología' | 'Bienestar' | 'Eco' | 'Mascotas';
  descripcion?: string;
}

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar:     { slug: 'hogar', nombre: 'Hogar', descripcion: 'Organización y decoración' },
  belleza:   { slug: 'belleza', nombre: 'Belleza', descripcion: 'Accesorios y cuidado personal' },
  tecnologia:{ slug: 'tecnologia', nombre: 'Tecnología', descripcion: 'Gadgets y accesorios' },
  bienestar: { slug: 'bienestar', nombre: 'Bienestar', descripcion: 'Fitness y salud' },
  eco:       { slug: 'eco', nombre: 'Eco', descripcion: 'Sustentables y reutilizables' },
  mascotas:  { slug: 'mascotas', nombre: 'Mascotas', descripcion: 'Accesorios para tus animales' },
};

export function listCategorias(): Categoria[] {
  return Object.values(CATEGORIAS);
}

export function normalizaCategoria(txt: string): CategoriaSlug | null {
  const t = (txt || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
  if (/hogar/.test(t)) return 'hogar';
  if (/belleza/.test(t)) return 'belleza';
  if (/tecno/.test(t)) return 'tecnologia';
  if (/bienestar|fitness|salud/.test(t)) return 'bienestar';
  if (/eco|susten|reutiliza/.test(t)) return 'eco';
  if (/mascota|pet/.test(t)) return 'mascotas';
  return null;
}

export function getCategoriaBySlug(slug: string): Categoria | null {
  const s = slug.toLowerCase() as CategoriaSlug;
  return CATEGORIAS[s] ?? null;
}
