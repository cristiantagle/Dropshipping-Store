export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: "belleza" | "hogar" | "tecnologia" | "bienestar" | "eco" | "mascotas";
};

const U = (path: string) => `https://images.unsplash.com/${path}?q=80&w=1200&auto=format&fit=crop`;

// BELLEZA
const belleza: Producto[] = [
  { id: "b1", nombre: "Organizador de maquillaje giratorio", precio: 15990, imagen: U("photo-1512496015851-a90fb38ba796"), categoria: "belleza" },
  { id: "b2", nombre: "Set de brochas premium 12p", precio: 12990, imagen: U("photo-1556228720-195a672e8a03"), categoria: "belleza" },
  { id: "b3", nombre: "Espejo LED con aumento", precio: 19990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
  { id: "b4", nombre: "Porta cosméticos acrílico", precio: 9990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
  { id: "b5", nombre: "Organizador joyas minimal", precio: 13990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
  { id: "b6", nombre: "Secador iónico portátil", precio: 25990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
  { id: "b7", nombre: "Plancha pelo cerámica", precio: 27990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
  { id: "b8", nombre: "Rizador ondas rápidas", precio: 24990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
  { id: "b9", nombre: "Limpia poros facial", precio: 16990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
  { id: "b10", nombre: "Bolso cosméticos viaje", precio: 10990, imagen: U("photo-1522335789203-aabd1fc54bc9"), categoria: "belleza" },
];

// HOGAR
const hogar: Producto[] = [
  { id: "h1", nombre: "Organizador plegable de clóset", precio: 8990, imagen: U("photo-1541562232579-512a21360020"), categoria: "hogar" },
  { id: "h2", nombre: "Zapatero vertical 7 niveles", precio: 14990, imagen: U("photo-1505693416388-ac5ce068fe85"), categoria: "hogar" },
  { id: "h3", nombre: "Perchero extensible metálico", precio: 17990, imagen: U("photo-1486406146926-c627a92ad1ab"), categoria: "hogar" },
  { id: "h4", nombre: "Caja organizadora con tapa (x3)", precio: 11990, imagen: U("photo-1505692952041-25d71b0943f5"), categoria: "hogar" },
  { id: "h5", nombre: "Cesta ropa plegable", precio: 7990, imagen: U("photo-1524758631624-e2822e304c36"), categoria: "hogar" },
  { id: "h6", nombre: "Set frascos de vidrio cocina (x6)", precio: 13990, imagen: U("photo-1468495244123-6c6c332eeece"), categoria: "hogar" },
  { id: "h7", nombre: "Repisa flotante minimal (x2)", precio: 16990, imagen: U("photo-1505691723518-36a5ac3be353"), categoria: "hogar" },
  { id: "h8", nombre: "Almohada memory foam", precio: 15990, imagen: U("photo-1519710164239-da123dc03ef4"), categoria: "hogar" },
  { id: "h9", nombre: "Manta térmica ligera", precio: 12990, imagen: U("photo-1519710884215-9d3ee677b95a"), categoria: "hogar" },
  { id: "h10", nombre: "Cortina blackout sencilla", precio: 13990, imagen: U("photo-1493666438817-866a91353ca9"), categoria: "hogar" },
];

// TECNOLOGÍA
const tecnologia: Producto[] = [
  { id: "t1", nombre: "Soporte notebook aluminio", precio: 16990, imagen: U("photo-1515879218367-8466d910aaa4"), categoria: "tecnologia" },
  { id: "t2", nombre: "Hub USB-C 7 en 1", precio: 22990, imagen: U("photo-1517336714731-489689fd1ca8"), categoria: "tecnologia" },
  { id: "t3", nombre: "Cargador inalámbrico rápido", precio: 14990, imagen: U("photo-1518779578993-ec3579fee39f"), categoria: "tecnologia" },
  { id: "t4", nombre: "Soporte celular auto magnético", precio: 9990, imagen: U("photo-1510557880182-3d4d3cba35f9"), categoria: "tecnologia" },
  { id: "t5", nombre: "Audífonos Bluetooth plegables", precio: 19990, imagen: U("photo-1518442077243-65f2f41d35c6"), categoria: "tecnologia" },
  { id: "t6", nombre: "Lámpara LED escritorio USB", precio: 11990, imagen: U("photo-1517694712202-14dd9538aa97"), categoria: "tecnologia" },
  { id: "t7", nombre: "Smartband actividad diaria", precio: 24990, imagen: U("photo-1511732351157-1865efcb7b7b"), categoria: "tecnologia" },
  { id: "t8", nombre: "Teclado bluetooth compacto", precio: 21990, imagen: U("photo-1519389950473-47ba0277781c"), categoria: "tecnologia" },
  { id: "t9", nombre: "Mouse ergonómico recargable", precio: 14990, imagen: U("photo-1517336714731-489689fd1ca8"), categoria: "tecnologia" },
  { id: "t10", nombre: "Soporte monitor VESA", precio: 29990, imagen: U("photo-1515879218367-8466d910aaa4"), categoria: "tecnologia" },
];

// BIENESTAR
const bienestar: Producto[] = [
  { id: "w1", nombre: "Banda elástica de resistencia", precio: 6990, imagen: U("photo-1517836357463-d25dfeac3438"), categoria: "bienestar" },
  { id: "w2", nombre: "Rueda abdominal pro", precio: 14990, imagen: U("photo-1517343985841-f7db4483b3c8"), categoria: "bienestar" },
  { id: "w3", nombre: "Esterilla yoga antideslizante", precio: 15990, imagen: U("photo-1506126613408-eca07ce68773"), categoria: "bienestar" },
  { id: "w4", nombre: "Masajeador cervical portátil", precio: 24990, imagen: U("photo-1580281657527-47d6bcb95cff"), categoria: "bienestar" },
  { id: "w5", nombre: "Botella térmica 1L", precio: 9990, imagen: U("photo-1535914254981-b5012eebbd15"), categoria: "bienestar" },
  { id: "w6", nombre: "Corrector de postura", precio: 12990, imagen: U("photo-1515378791036-0648a3ef77b2"), categoria: "bienestar" },
  { id: "w7", nombre: "Soga para saltar con contador", precio: 8990, imagen: U("photo-1517832606299-7ae9b720a186"), categoria: "bienestar" },
  { id: "w8", nombre: "Mini pistola de masaje", precio: 28990, imagen: U("photo-1599058917212-d750089bc07d"), categoria: "bienestar" },
  { id: "w9", nombre: "Rodillo de espuma", precio: 11990, imagen: U("photo-1546484475-7f7bd55792da"), categoria: "bienestar" },
  { id: "w10", nombre: "Balanza corporal digital", precio: 16990, imagen: U("photo-1560807707-8cc77767d783"), categoria: "bienestar" },
];

// ECO
const eco: Producto[] = [
  { id: "e1", nombre: "Bolsas reutilizables frutas (x10)", precio: 6990, imagen: U("photo-1515549832467-8783363e19b6"), categoria: "eco" },
  { id: "e2", nombre: "Cepillos bambú (x4)", precio: 6990, imagen: U("photo-1528909514045-2fa4ac7a08ba"), categoria: "eco" },
  { id: "e3", nombre: "Bombillas acero + estuche", precio: 5990, imagen: U("photo-1528909514045-2fa4ac7a08ba"), categoria: "eco" },
  { id: "e4", nombre: "Botella vidrio con funda", precio: 9990, imagen: U("photo-1535914254981-b5012eebbd15"), categoria: "eco" },
  { id: "e5", nombre: "Beeswax wraps (x3)", precio: 9990, imagen: U("photo-1515549832467-8783363e19b6"), categoria: "eco" },
  { id: "e6", nombre: "Set cubiertos bambú viaje", precio: 7990, imagen: U("photo-1528909514045-2fa4ac7a08ba"), categoria: "eco" },
  { id: "e7", nombre: "Vasos plegables silicona (x2)", precio: 8990, imagen: U("photo-1515549832467-8783363e19b6"), categoria: "eco" },
  { id: "e8", nombre: "Filtros café reutilizables", precio: 5990, imagen: U("photo-1515549832467-8783363e19b6"), categoria: "eco" },
  { id: "e9", nombre: "Bolsa térmica almuerzo eco", precio: 11990, imagen: U("photo-1515549832467-8783363e19b6"), categoria: "eco" },
  { id: "e10", nombre: "Esponjas compostables (x6)", precio: 6990, imagen: U("photo-1528909514045-2fa4ac7a08ba"), categoria: "eco" },
];

// MASCOTAS
const mascotas: Producto[] = [
  { id: "m1", nombre: "Peine removedor de pelo", precio: 7990, imagen: U("photo-1548199973-03cce0bbc87b"), categoria: "mascotas" },
  { id: "m2", nombre: "Dispensador de agua portátil", precio: 9990, imagen: U("photo-1546443046-ed1ce6ffd1b7"), categoria: "mascotas" },
  { id: "m3", nombre: "Juguete mordedor resistente", precio: 6990, imagen: U("photo-1546443046-ed1ce6ffd1b7"), categoria: "mascotas" },
  { id: "m4", nombre: "Arnés anti tirones", precio: 12990, imagen: U("photo-1548199973-03cce0bbc87b"), categoria: "mascotas" },
  { id: "m5", nombre: "Cama redonda suave", precio: 19990, imagen: U("photo-1558944351-c0fcd0b5f0b4"), categoria: "mascotas" },
  { id: "m6", nombre: "Comedero doble antideslizante", precio: 10990, imagen: U("photo-1546443046-ed1ce6ffd1b7"), categoria: "mascotas" },
  { id: "m7", nombre: "Cortaúñas de seguridad", precio: 5990, imagen: U("photo-1548199973-03cce0bbc87b"), categoria: "mascotas" },
  { id: "m8", nombre: "Cepillo deslanador premium", precio: 9990, imagen: U("photo-1548199973-03cce0bbc87b"), categoria: "mascotas" },
  { id: "m9", nombre: "Bebedero automático 2L", precio: 21990, imagen: U("photo-1546443046-ed1ce6ffd1b7"), categoria: "mascotas" },
  { id: "m10", nombre: "Transportador plegable", precio: 24990, imagen: U("photo-1558944351-c0fcd0b5f0b4"), categoria: "mascotas" },
];

export const productos: Producto[] = [
  ...belleza, ...hogar, ...tecnologia, ...bienestar, ...eco, ...mascotas,
];
