interface Product {
  id: string;
  name: string;
  image_url: string;
  price_cents: number;
}

export default function ProductCard({ id, name, image_url, price_cents }: Product) {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(cents);

  return (
    <div
      key={id}
      className="w-[160px] flex-shrink-0 bg-white rounded-lg border border-gray-200 p-3 flex flex-col items-center hover:shadow-md"
    >
      <div className="w-full h-32 flex items-center justify-center bg-white mb-3 overflow-hidden">
        <img
          src={image_url}
          alt={name}
          className="max-h-28 object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>
      <h3 className="text-sm font-medium text-center line-clamp-2 h-10">{name}</h3>
      <p className="text-lime-700 font-bold mt-2 text-base">{formatPrice(price_cents)}</p>
    </div>
  );
}
