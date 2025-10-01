interface Product {
  id: string;
  name: string;
  image_url: string;
  price_cents: number;
}

interface Props {
  title: string;
  description: string;
  products: Product[];
  link: string;
}

export default function CategoryCarousel({ title, description, products, link }: Props) {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(cents);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[250px] bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-center">{product.name}</h3>
              <p className="text-lime-700 font-bold mt-2">{formatPrice(product.price_cents)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <a
          href={link}
          className="inline-block bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-md font-semibold"
        >
          Ver todo
        </a>
      </div>
    </section>
  );
}
