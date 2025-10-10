import Link from "next/link";

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  badge?: "Nuevo" | "Oferta";
}

export default function ProductCard({ id, name, name_es, image_url, price_cents, badge }: Product) {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents);

  return (
    <Link
      href={`/producto/${id}`}
      className="relative min-w-[200px] flex-shrink-0 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 flex flex-col group"
    >
      {badge && (
        <span className="absolute top-2 left-2 bg-lime-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
          {badge}
        </span>
      )}
      <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-t-xl overflow-hidden">
        <img
          src={image_url}
          alt={name_es || name}
          className="max-h-36 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
          {name_es || name}
        </h3>
        <p className="text-lime-700 font-bold text-lg mt-3">{formatPrice(price_cents)}</p>
      </div>
    </Link>
  );
}
