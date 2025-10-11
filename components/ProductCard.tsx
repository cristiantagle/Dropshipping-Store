"use client";

import Link from "next/link";
import { useProductText } from "@/lib/useProductText";
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { formatPrice } from "@/lib/formatPrice";
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
      className="relative min-w-[200px] flex-shrink-0 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02] flex flex-col group overflow-hidden backdrop-blur-sm"
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
      <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img
          src={image_url}
          alt={displayName}
          className="max-h-36 object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-105 group-hover:contrast-105 filter drop-shadow-sm"
        />
      </div>
        <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {displayName}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lime-700 font-bold text-lg group-hover:text-lime-800 transition-colors duration-300">
              {formatPrice(price_cents)}
            </p>
            <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
              <div className="w-2 h-2 bg-lime-600 rounded-full" />
            </div>
          </div>
        </div>
      </Link>
      
      {/* Botón Add to Cart fuera del Link */}
      <div className="px-5 pb-5 pt-0" onClick={handleCartClick}>
        <AddToCartButton 
          product={{
            id,
            name,
            name_es,
            image_url,
            price_cents,
            category_slug,
          }}
          className="w-full text-sm font-medium py-2.5 rounded-lg transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
        />
      </div>
    </div>
  );
}
