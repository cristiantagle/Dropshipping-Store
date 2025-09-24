export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const sampleProducts: Product[] = [
  { id: "p1", name: "Polera Lunaria", price: 12990, image: "/polera.jpg" },
  { id: "p2", name: "Taza Lunaria", price: 5990, image: "/taza.jpg" },
  { id: "p3", name: "Mochila Lunaria", price: 24990, image: "/mochila.jpg" }
];
