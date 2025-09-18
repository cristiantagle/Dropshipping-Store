export type Categoria = { slug: string; nombre: string; imagen: string };

export const categorias: Categoria[] = [
  {
    slug: "belleza",
    nombre: "Belleza & Cuidado (Accesorios)",
    imagen: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop"
  },
  {
    slug: "hogar",
    nombre: "Hogar & Organización",
    imagen: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    slug: "tecnologia",
    nombre: "Accesorios Tech",
    imagen: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200&auto=format&fit=crop"
  }
];
