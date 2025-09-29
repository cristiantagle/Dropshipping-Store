import { supabase } from "./supabase/client";

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
  const { data, error } = await supabase
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
