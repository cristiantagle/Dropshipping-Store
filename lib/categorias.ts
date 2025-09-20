export type CategoriaSlug = 'hogar'|'belleza'|'tecnologia'|'bienestar'|'eco'|'mascotas';
export const CATEGORIAS: { slug: CategoriaSlug; nombre: string; descripcion?: string }[] = [
  { slug:'hogar', nombre:'Hogar' },
  { slug:'belleza', nombre:'Belleza' },
  { slug:'tecnologia', nombre:'Tecnología' },
  { slug:'bienestar', nombre:'Bienestar' },
  { slug:'eco', nombre:'Eco' },
  { slug:'mascotas', nombre:'Mascotas' },
];
export const isCategoria = (s: string): s is CategoriaSlug =>
  ['hogar','belleza','tecnologia','bienestar','eco','mascotas'].includes(s);
export const getCategoriaBySlug = (s: string) =>
  CATEGORIAS.find(c => c.slug === s);
