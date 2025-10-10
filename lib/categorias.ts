export type Categoria = {
  slug: string;
  nombre: string;
  image_url: string;
};

export const categorias: Categoria[] = [
  {
    slug: "belleza",
    nombre: "Belleza",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/belleza.svg",
  },
  {
    slug: "bienestar",
    nombre: "Bienestar",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/bienestar.svg",
  },
  {
    slug: "eco",
    nombre: "Eco",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/eco.svg",
  },
  {
    slug: "hogar",
    nombre: "Hogar",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/hogar.svg",
  },
  {
    slug: "mascotas",
    nombre: "Mascotas",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/mascotas.svg",
  },
  {
    slug: "oficina",
    nombre: "Oficina",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/oficina.svg",
  },
  {
    slug: "tecnologia",
    nombre: "Tecnología",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/tecnologia.svg",
  },
  {
    slug: "ropa_hombre",
    nombre: "Ropa Hombre",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/belleza.svg", // Placeholder consistente
  },
  {
    slug: "ropa_mujer",
    nombre: "Ropa Mujer",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/belleza.svg", // Placeholder consistente
  },
  {
    slug: "accesorios",
    nombre: "Accesorios",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/oficina.svg", // Reusar icono existente
  },
  {
    slug: "otros",
    nombre: "Otros",
    image_url: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/hogar.svg", // Reusar icono existente
  },
];

// ✅ Devuelve todas las categorías
export function getAllCategories(): Categoria[] {
  return categorias;
}

// ✅ Busca una categoría por slug
export function getCategory(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}
