export type Producto = {
  id: string;
  nombre: string;
  categoria: "belleza" | "hogar" | "tecnologia";
  envio: string;
  precio: number;
  imagen: string;
  destacado?: boolean;
};

const E = "Internacional 12–25 días";

export const productos: Producto[] = [
  // BELLEZA (10)
  { id: "b1",  nombre: "Rizador cerámico 28mm", categoria: "belleza", envio: E, precio: 19990, imagen: "https://images.unsplash.com/photo-1618173419590-8aa0e9c04aa8?q=80&w=1200&auto=format&fit=crop", destacado: true },
  { id: "b2",  nombre: "Set brochas x10", categoria: "belleza", envio: E, precio: 12990, imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop" },
  { id: "b3",  nombre: "Organizador acrílico", categoria: "belleza", envio: E, precio: 14990, imagen: "https://images.unsplash.com/photo-1512203492609-8f7f06f1f8f3?q=80&w=1200&auto=format&fit=crop" },
  { id: "b4",  nombre: "Rodillo facial cuarzo", categoria: "belleza", envio: E, precio: 9990,  imagen: "https://images.unsplash.com/photo-1585238342028-4bbc0c8693e5?q=80&w=1200&auto=format&fit=crop" },
  { id: "b5",  nombre: "Espejo LED de tocador", categoria: "belleza", envio: E, precio: 17990, imagen: "https://images.unsplash.com/photo-1512499617640-c2f999098c73?q=80&w=1200&auto=format&fit=crop", destacado: true },
  { id: "b6",  nombre: "Banda cabello spa", categoria: "belleza", envio: E, precio: 4990,  imagen: "https://images.unsplash.com/photo-1556228453-efd1ad1ff1bf?q=80&w=1200&auto=format&fit=crop" },
  { id: "b7",  nombre: "Porta-cosmé tico rotatorio", categoria: "belleza", envio: E, precio: 16990, imagen: "https://images.unsplash.com/photo-1629198735668-e847f3d8a2b7?q=80&w=1200&auto=format&fit=crop" },
  { id: "b8",  nombre: "Mini vaporizador facial", categoria: "belleza", envio: E, precio: 13990, imagen: "https://images.unsplash.com/photo-1596464716121-cf32156fc0f1?q=80&w=1200&auto=format&fit=crop" },
  { id: "b9",  nombre: "Neceser impermeable", categoria: "belleza", envio: E, precio: 8990,  imagen: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop" },
  { id: "b10", nombre: "Set bandas resistencia", categoria: "belleza", envio: E, precio: 7990,  imagen: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop" },

  // HOGAR (10)
  { id: "h1",  nombre: "Organizador plegable clóset", categoria: "hogar", envio: E, precio: 13990, imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop", destacado: true },
  { id: "h2",  nombre: "Dispensador aceite medidor", categoria: "hogar", envio: E, precio: 10990, imagen: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop" },
  { id: "h3",  nombre: "Luz nocturna sensor", categoria: "hogar", envio: E, precio: 9990,  imagen: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?q=80&w=1200&auto=format&fit=crop" },
  { id: "h4",  nombre: "Soporte escobas pared", categoria: "hogar", envio: E, precio: 8990,  imagen: "https://images.unsplash.com/photo-1519710881401-64e0d04d7e24?q=80&w=1200&auto=format&fit=crop" },
  { id: "h5",  nombre: "Difusor aromaterapia", categoria: "hogar", envio: E, precio: 15990, imagen: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop", destacado: true },
  { id: "h6",  nombre: "Caja organizadora apilable", categoria: "hogar", envio: E, precio: 6990,  imagen: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop" },
  { id: "h7",  nombre: "Almohada ergonómica", categoria: "hogar", envio: E, precio: 17990, imagen: "https://images.unsplash.com/photo-1522335789203-9d8aa1a3be19?q=80&w=1200&auto=format&fit=crop" },
  { id: "h8",  nombre: "Felpudo antideslizante", categoria: "hogar", envio: E, precio: 5990,  imagen: "https://images.unsplash.com/photo-1541534401786-2077eed87a74?q=80&w=1200&auto=format&fit=crop" },
  { id: "h9",  nombre: "Perchas antideslizantes x20", categoria: "hogar", envio: E, precio: 12990, imagen: "https://images.unsplash.com/photo-1618355776460-3bd3a94474e2?q=80&w=1200&auto=format&fit=crop" },
  { id: "h10", nombre: "Organizador cajones 8p", categoria: "hogar", envio: E, precio: 9990,  imagen: "https://images.unsplash.com/photo-1616594039964-ae9021c7783e?q=80&w=1200&auto=format&fit=crop" },

  // TECNOLOGÍA (10)
  { id: "t1",  nombre: "Cargador rápido 20W USB-C", categoria: "tecnologia", envio: E, precio: 11990, imagen: "https://images.unsplash.com/photo-1555617981-dac3880f27df?q=80&w=1200&auto=format&fit=crop", destacado: true },
  { id: "t2",  nombre: "Cable trenzado 1.5m USB-C", categoria: "tecnologia", envio: E, precio: 5990,  imagen: "https://images.unsplash.com/photo-1600856509837-2a7b4306b765?q=80&w=1200&auto=format&fit=crop" },
  { id: "t3",  nombre: "Soporte magnético auto", categoria: "tecnologia", envio: E, precio: 7990,  imagen: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1200&auto=format&fit=crop" },
  { id: "t4",  nombre: "Audífonos in-ear con mic", categoria: "tecnologia", envio: E, precio: 14990, imagen: "https://images.unsplash.com/photo-1518443819140-44b7a5a7c31a?q=80&w=1200&auto=format&fit=crop" },
  { id: "t5",  nombre: "Soporte notebook plegable", categoria: "tecnologia", envio: E, precio: 15990, imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop", destacado: true },
  { id: "t6",  nombre: "Funda silicona control", categoria: "tecnologia", envio: E, precio: 6990,  imagen: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=1200&auto=format&fit=crop" },
  { id: "t7",  nombre: "Hub USB-C 5-en-1", categoria: "tecnologia", envio: E, precio: 18990, imagen: "https://images.unsplash.com/photo-1512499617640-c2f999098c73?q=80&w=1200&auto=format&fit=crop" },
  { id: "t8",  nombre: "Mouse inalámbrico slim", categoria: "tecnologia", envio: E, precio: 9990,  imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" },
  { id: "t9",  nombre: "Teclado compacto BT", categoria: "tecnologia", envio: E, precio: 19990, imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" },
  { id: "t10", nombre: "Soporte celular escritorio", categoria: "tecnologia", envio: E, precio: 6990,  imagen: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop" }
];
