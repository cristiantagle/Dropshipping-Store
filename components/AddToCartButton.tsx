"use client";

import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
}

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { showCartAction } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      addToCart({
        id: product.id,
        name: product.name,
        name_es: product.name_es,
        image_url: product.image_url,
        price_cents: product.price_cents,
        category_slug: product.category_slug,
      });

      // Show toast notification
      showCartAction(
        '¡Agregado al carrito!',
        `${product.name_es || product.name} se agregó correctamente`
      );

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const currentQuantity = getItemQuantity(product.id);

  if (justAdded) {
    return (
      <button
        className={`flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 ${className}`}
        disabled
      >
        <Check className="w-4 h-4" />
        ¡Agregado!
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAdding ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Agregando...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {currentQuantity > 0 ? `Agregar (${currentQuantity})` : 'Agregar al carrito'}
        </>
      )}
    </button>
  );
}