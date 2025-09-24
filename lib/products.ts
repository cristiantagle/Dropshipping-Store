export interface Producto {
  id: string;
  nombre: string;
  precio?: number | null;
  descripcion?: string | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  categoria_slug?: string | null;
  destacado?: boolean | null;
  created_at?: string | null;
  ventas?: number | null;
}
