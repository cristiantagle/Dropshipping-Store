import { supabaseServer } from "@/lib/supabase";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  envio: string;
  destacado?: boolean;
};

export async function getProducts(): Promise<Producto[]> {
  const { data, error } = await supabaseServer()
    .from("products")
    .select("*");

  if (error) {
    console.error("Error al cargar productos:", error.message);
    throw error;
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    nombre: row.name ?? "Sin nombre",
    precio: row.price_cents ?? 0,
    imagen: row.image_url ?? "/lunaria-icon.png",
    categoria: row.category_slug ?? "general",
    envio: row.envio ?? "Envío estándar",
    destacado: row.destacado ?? false,
  }));
}

export async function getProductById(id: string): Promise<Producto | null> {
  const { data, error } = await supabaseServer()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar producto:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    nombre: data.name ?? "Sin nombre",
    precio: data.price_cents ?? 0,
    imagen: data.image_url ?? "/lunaria-icon.png",
    categoria: data.category_slug ?? "general",
    envio: data.envio ?? "Envío estándar",
    destacado: data.destacado ?? false,
  };
}

export async function getProductsByCategory(slug: string): Promise<Producto[]> {
  const { data, error } = await supabaseServer()
    .from("products")
    .select("*")
    .eq("category_slug", slug);

  if (error) {
    console.error("Error al cargar productos por categoría:", error.message);
    throw error;
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    nombre: row.name ?? "Sin nombre",
    precio: row.price_cents ?? 0,
    imagen: row.image_url ?? "/lunaria-icon.png",
    categoria: row.category_slug ?? "general",
    envio: row.envio ?? "Envío estándar",
    destacado: row.destacado ?? false,
  }));
}
