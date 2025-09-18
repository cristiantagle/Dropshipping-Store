export type Producto = {
  id: string;
  nombre: string;
  categoria: string; // slug de Categoria
  envio: string;     // "Internacional 12–25 días" / "Despacho 24–72 h"
  precio: number;    // CLP
  imagen: string;
};

export const productos: Producto[] = [
  // Belleza
  { id: "b1", nombre: "Rizador cerámico 28mm", categoria: "belleza", envio: "Internacional 12–25 días", precio: 19990, imagen: "https://images.unsplash.com/photo-1618173419590-8aa0e9c04aa8?q=80&w=1200&auto=format&fit=crop" },
  { id: "b2", nombre: "Set brochas maquillaje (10 pcs)", categoria: "belleza", envio: "Internacional 12–25 días", precio: 12990, imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop" },
  { id: "b3", nombre: "Organizador acrílico cosméticos", categoria: "belleza", envio: "Internacional 12–25 días", precio: 14990, imagen: "https://images.unsplash.com/photo-1512203492609-8f7f06f1f8f3?q=80&w=1200&auto=format&fit=crop" },
  { id: "b4", nombre: "Rodillo facial de cuarzo", categoria: "belleza", envio: "Internacional 12–25 días", precio: 9990, imagen: "https://images.unsplash.com/photo-1585238342028-4bbc0c8693e5?q=80&w=1200&auto=format&fit=crop" },

  // Hogar
  { id: "h1", nombre: "Organizador plegable de clóset", categoria: "hogar", envio: "Internacional 12–25 días", precio: 13990, imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop" },
  { id: "h2", nombre: "Dispensador aceite con medidor", categoria: "hogar", envio: "Internacional 12–25 días", precio: 10990, imagen: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop" },
  { id: "h3", nombre: "Luz nocturna sensor movimiento", categoria: "hogar", envio: "Internacional 12–25 días", precio: 9990, imagen: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?q=80&w=1200&auto=format&fit=crop" },
  { id: "h4", nombre: "Soporte escobas pared (5 ganchos)", categoria: "hogar", envio: "Internacional 12–25 días", precio: 8990, imagen: "https://images.unsplash.com/photo-1519710881401-64e0d04d7e24?q=80&w=1200&auto=format&fit=crop" },

  // Tech
  { id: "t1", nombre: "Cargador rápido 20W USB-C", categoria: "tecnologia", envio: "Internacional 12–25 días", precio: 11990, imagen: "https://images.unsplash.com/photo-1555617981-dac3880f27df?q=80&w=1200&auto=format&fit=crop" },
  { id: "t2", nombre: "Cable trenzado USB-C 1.5m", categoria: "tecnologia", envio: "Internacional 12–25 días", precio: 5990, imagen: "https://images.unsplash.com/photo-1600856509837-2a7b4306b765?q=80&w=1200&auto=format&fit=crop" },
  { id: "t3", nombre: "Soporte magnético auto", categoria: "tecnologia", envio: "Internacional 12–25 días", precio: 7990, imagen: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1200&auto=format&fit=crop" },
  { id: "t4", nombre: "Audífonos in-ear con mic", categoria: "tecnologia", envio: "Internacional 12–25 días", precio: 14990, imagen: "https://images.unsplash.com/photo-1518443819140-44b7a5a7c31a?q=80&w=1200&auto=format&fit=crop" }
];
