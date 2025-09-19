import { supabaseAdmin } from "./supabase/server";

export type Categoria = {
  slug: string;
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
};

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen_url?: string | null;
  envio?: string | null;
  destacado?: boolean | null;
  categoria_slug: string;
};

export async function getCategorias(): Promise<Categoria[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("categorias").select("*").order("nombre");
  if (error) throw error;
  return data || [];
}

export async function getProductosByCategoria(slug: string, limit = 12): Promise<Producto[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("productos")
    .select("*")
    .eq("categoria_slug", slug)
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getCategoria(slug: string): Promise<Categoria | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("categorias")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
