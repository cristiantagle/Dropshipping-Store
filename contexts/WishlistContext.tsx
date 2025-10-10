"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Tipos TypeScript
export interface WishlistItem {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
  dateAdded: string;
}

export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

export type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Omit<WishlistItem, 'dateAdded'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

// Estado inicial
const initialState: WishlistState = {
  items: [],
  totalItems: 0,
};

// Reducer para manejar acciones de la wishlist
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Verificar si el item ya existe
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // No agregar duplicados
      }

      const newItem: WishlistItem = {
        ...action.payload,
        dateAdded: new Date().toISOString(),
      };

      const newItems = [...state.items, newItem];

      return {
        items: newItems,
        totalItems: newItems.length,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);

      return {
        items: newItems,
        totalItems: newItems.length,
      };
    }

    case 'CLEAR_WISHLIST':
      return {
        items: [],
        totalItems: 0,
      };

    case 'LOAD_WISHLIST': {
      const items = action.payload;
      return {
        items,
        totalItems: items.length,
      };
    }

    default:
      return state;
  }
}

// Context
const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | null>(null);

// Provider Component
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Cargar wishlist desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('lunaria-wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  }, []);

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    try {
      localStorage.setItem('lunaria-wishlist', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [state.items]);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
}

// Hook personalizado para usar la wishlist
export function useWishlist() {
  const context = useContext(WishlistContext);
  
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  const { state, dispatch } = context;

  // Funciones helper
  const addToWishlist = (product: Omit<WishlistItem, 'dateAdded'>) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const toggleWishlist = (product: Omit<WishlistItem, 'dateAdded'>) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item.id === productId);
  };

  // Formato de precio helper (reutilizado del carrito)
  const formatPrice = (cents: number) => {
    const USD_TO_CLP = Number(process.env.NEXT_PUBLIC_USD_TO_CLP) || 950;
    const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;
    
    const clp = (cents / 100) * USD_TO_CLP;
    const finalPrice = clp * MARKUP;
    
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(finalPrice);
  };

  return {
    // Estado
    items: state.items,
    totalItems: state.totalItems,
    
    // Funciones
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlist,
    isInWishlist,
    formatPrice,
  };
}