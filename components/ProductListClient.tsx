import ProductCard from "./ProductCard";

interface Producto {
  id: string;
  name: string;
  image_url: string | null;
  price_cents: number | null;
  category_slug: string;
}

export default function ProductListClient({ products }: { products: Producto[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          id={p.id}
          name={p.name}
          image_url={p.image_url ?? ""}
          price_cents={p.price_cents ?? 0}
        />
      ))}
    </div>
  );
}
