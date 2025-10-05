interface Props {
  products: any[];
}

export default function ProductCarousel({ products }: Props) {
  return (
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
          </div>
        ))}
      </div>
    </div>
  );
}
