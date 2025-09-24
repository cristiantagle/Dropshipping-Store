import { supabase } from "./supabase-wrapper";

export interface Producto {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_slug: string;
}

function pickImage(p: any): string {
  return p.image || p.imagen || p.image_url || p.imagen_url || "";
}

export async function getProducts(categorySlug?: string): Promise<Producto[]> {
  let query = supabase
    .from("products")
    .select("id, name, description, price_cents, precio, image, imagen, image_url, imagen_url, category_slug");

  if (categorySlug) {
    query = query.eq("category_slug", categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("❌ Error cargando productos:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: p.price_cents ?? p.precio ?? 0,
    image: pickImage(p),
    category_slug: p.category_slug ?? "",
  }));
}
