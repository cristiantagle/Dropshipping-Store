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

export function getCategoriaBySlug(slug: string) {
  return CATEGORIAS.find(c => c.slug === slug);
}
