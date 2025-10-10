"use client";

import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
}

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function WishlistButton({ 
  product, 
  size = 'md', 
  className = "" 
}: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showSuccess, showError } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const isLiked = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    toggleWishlist({
      id: product.id,
      name: product.name,
      name_es: product.name_es,
      image_url: product.image_url,
      price_cents: product.price_cents,
      category_slug: product.category_slug,
    });

    // Show toast notification
    if (isLiked) {
      showError(
        'Removido de favoritos',
        `${product.name_es || product.name} se eliminó de tu lista de deseos`
      );
    } else {
      showSuccess(
        '¡Agregado a favoritos!',
        `${product.name_es || product.name} se guardó en tu lista de deseos`
      );
    }
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center transition-all duration-200 group
        ${isLiked 
          ? 'bg-pink-100 hover:bg-pink-200 text-pink-600' 
          : 'bg-white/80 hover:bg-white text-gray-400 hover:text-pink-500'
        }
        shadow-md hover:shadow-lg hover:scale-105
        ${isAnimating ? 'animate-bounce' : ''}
        ${className}
      `}
      title={isLiked ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={`
          ${iconSizes[size]} transition-all duration-200
          ${isLiked ? 'fill-current' : 'group-hover:fill-current group-hover:text-pink-500'}
        `}
      />
    </button>
  );
}