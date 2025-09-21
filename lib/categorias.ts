export type CategoriaSlug = 'hogar'|'belleza'|'tecnologia'|'bienestar'|'eco'|'mascotas';
export const CATEGORIAS: { slug: CategoriaSlug; nombre: string; descripcion?: string }[] = [
  { slug:'hogar', nombre:'Hogar' },
  { slug:'belleza', nombre:'Belleza' },
  { slug:'tecnologia', nombre:'Tecnología' },
  { slug:'bienestar', nombre:'Bienestar' },
  { slug:'eco', nombre:'Eco' },
  { image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop', slug:'mascotas', nombre:'Mascotas' },
];
export const isCategoria = (s: string): s is CategoriaSlug =>
  ['hogar','belleza','tecnologia','bienestar','eco','mascotas'].includes(s);
export const getCategoriaBySlug = (s: string) =>
  CATEGORIAS.find(c => c.slug === s);
