export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: "Hogar" | "Mascotas" | "Belleza" | "Bienestar" | "Tecnología" | "Eco";
  envio: "Rápido (stock local)" | "Importado (AliExpress Premium)" | "Importado (Estándar)";
  destacado?: boolean;
};
export const productos: Producto[] = [
  { id: "hogar-001", nombre: "Organizador plegable multiuso", precio: 12990, imagen: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200&auto=format&fit=crop", categoria: "Hogar", envio: "Rápido (stock local)", destacado: true },
  { id: "pet-001", nombre: "Juguete mordedor reforzado", precio: 9990, imagen: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop", categoria: "Mascotas", envio: "Importado (AliExpress Premium)" },
  { id: "beauty-001", nombre: "Set brochas compactas", precio: 14990, imagen: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop", categoria: "Belleza", envio: "Rápido (stock local)", destacado: true },
  { id: "fit-001", nombre: "Banda elástica resistencia", precio: 6990, imagen: "https://images.unsplash.com/photo-1517836357463-d25dfeac8d58?q=80&w=1200&auto=format&fit=crop", categoria: "Bienestar", envio: "Importado (Estándar)" , image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"},
  { id: "tech-001", nombre: "Soporte aluminio para notebook", precio: 19990, imagen: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop", categoria: "Tecnología", envio: "Rápido (stock local)", destacado: true },
  { id: "eco-001", nombre: "Set bolsas reutilizables frutas/verduras", precio: 7990, imagen: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop", categoria: "Eco", envio: "Importado (AliExpress Premium)" }
];
