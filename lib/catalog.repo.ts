import { supabaseServer } from "@/lib/supabase/server";
import { CATEGORIAS, isCategoriaSlug, type CategoriaSlug, type Producto, type Categoria } from "./catalog";

export async function listCategorias(): Promise<Categoria[]> {
  return CATEGORIAS;
}

export async function listProductosByCategoria(slug: string, limit = 12): Promise<Producto[]> {
  if (!isCategoriaSlug(slug)) return [];
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,precio,imagen_url,categoria_slug,descripcion")
    .eq("categoria_slug", slug as CategoriaSlug)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return (data ?? []) as Producto[];
}
