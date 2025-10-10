"use client";

import Link from "next/link";
import { useProductText } from "@/lib/useProductText";
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  badge?: "Nuevo" | "Oferta";
  category_slug?: string;
}

export default function ProductCard({ id, name, name_es, image_url, price_cents, badge, category_slug }: Product) {
  const { name: displayName } = useProductText({ name, name_es });
  const { addProduct } = useRecentlyViewed();

  const USD_TO_CLP = Number(process.env.NEXT_PUBLIC_USD_TO_CLP) || 950;
  const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;

  const formatPrice = (cents: number) => {
    const clp = (cents / 100) * USD_TO_CLP;
    const finalPrice = clp * MARKUP;
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(finalPrice);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleProductView = () => {
    // Track product as viewed when user hovers
    addProduct({
      id,
      name,
      name_es,
      image_url,
      price_cents,
      category_slug,
    });
  };

  return (
    <div 
      className="relative min-w-[200px] flex-shrink-0 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 flex flex-col group"
      onMouseEnter={handleProductView}
    >
      <Link href={`/producto/${id}`} className="flex flex-col flex-1">
      {badge && (
        <span className="absolute top-2 left-2 bg-lime-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md z-10">
          {badge}
        </span>
      )}
      
      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton 
          product={{
            id,
            name,
            name_es,
            image_url,
            price_cents,
            category_slug,
          }}
          size="sm"
        />
      </div>
      <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-t-xl overflow-hidden">
        <img
          src={image_url}
          alt={displayName}
          className="max-h-36 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
        <div className="p-4 flex flex-col flex-1 justify-between">
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
            {displayName}
          </h3>
          <p className="text-lime-700 font-bold text-lg mt-3">{formatPrice(price_cents)}</p>
        </div>
      </Link>
      
      {/* Botón Add to Cart fuera del Link */}
      <div className="p-4 pt-0" onClick={handleCartClick}>
        <AddToCartButton 
          product={{
            id,
            name,
            name_es,
            image_url,
            price_cents,
            category_slug,
          }}
          className="w-full text-sm"
        />
      </div>
    </div>
  );
}
