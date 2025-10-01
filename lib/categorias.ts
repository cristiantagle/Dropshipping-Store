export const categorias = [
  { nombre: "Belleza", slug: "belleza", icon: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/belleza.svg" },
  { nombre: "Bienestar", slug: "bienestar", icon: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/bienestar.svg" },
  { nombre: "Eco", slug: "eco", icon: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/eco.svg" },
  { nombre: "Hogar", slug: "hogar", icon: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/hogar.svg" },
  { nombre: "Mascotas", slug: "mascotas", icon: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/mascotas.svg" },
  { nombre: "Tecnología", slug: "tecnologia", icon: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/tecnologia.svg" },
  { nombre: "Próximamente", icon: "https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/categorias/oficina.svg" },
];

export type Categoria = {
  nombre: string;
  descripcion?: string;
  slug?: string;
  icon: string;
};

export function getAllCategories(): Categoria[] {
  return categorias;
}

export function getCategory(slug: string): Categoria | null {
  const found = categorias.find((c: any) => c.slug === slug);
  return found ?? null;
}
