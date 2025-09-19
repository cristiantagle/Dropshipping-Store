export type CategoriaSlug = 'hogar'|'belleza'|'tecnologia'|'bienestar'|'eco'|'mascotas';

export interface Categoria {
  slug: CategoriaSlug;
  nombre: 'Hogar'|'Belleza'|'Tecnología'|'Bienestar'|'Eco'|'Mascotas';
  descripcion?: string;
}

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar: { slug:'hogar', nombre:'Hogar', descripcion:'Organización y decoración' },
  belleza: { slug:'belleza', nombre:'Belleza', descripcion:'Accesorios y cuidado personal' },
  tecnologia: { slug:'tecnologia', nombre:'Tecnología', descripcion:'Gadgets y accesorios' },
  bienestar: { slug:'bienestar', nombre:'Bienestar', descripcion:'Fitness y salud' },
  eco: { slug:'eco', nombre:'Eco', descripcion:'Sustentables y reutilizables' },
  mascotas: { slug:'mascotas', nombre:'Mascotas', descripcion:'Accesorios para tus animales' },
};

export function listCategorias(){ return Object.values(CATEGORIAS); }

export function normalizaCategoria(txt: string): CategoriaSlug | null {
  const t = (txt||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
  if (t.includes('hogar')) return 'hogar';
  if (t.includes('belleza')) return 'belleza';
  if (t.includes('tecno')) return 'tecnologia';
  if (t.includes('bienestar')||t.includes('fitness')||t.includes('salud')) return 'bienestar';
  if (t.includes('eco')||t.includes('susten')||t.includes('reutiliza')) return 'eco';
  if (t.includes('mascota')||t.includes('pet')) return 'mascotas';
  return null;
}

export function getCategoriaBySlug(slug: string){
  return CATEGORIAS[slug.toLowerCase() as CategoriaSlug] ?? null;
}
