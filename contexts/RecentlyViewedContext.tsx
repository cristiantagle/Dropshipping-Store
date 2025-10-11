"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Tipos TypeScript
export interface ViewedProduct {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
  viewedAt: string;
}

export interface RecentlyViewedState {
  products: ViewedProduct[];
  maxItems: number;
}

export type RecentlyViewedAction =
  | { type: 'ADD_PRODUCT'; payload: Omit<ViewedProduct, 'viewedAt'> }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'LOAD_HISTORY'; payload: ViewedProduct[] };

// Estado inicial
const initialState: RecentlyViewedState = {
  products: [],
  maxItems: 12, // Máximo 12 productos en el historial
};

// Reducer para manejar acciones de recently viewed
function recentlyViewedReducer(state: RecentlyViewedState, action: RecentlyViewedAction): RecentlyViewedState {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      // Verificar si el producto ya es el más reciente para evitar updates innecesarios
      const existingProduct = state.products.find(p => p.id === action.payload.id);
      if (existingProduct && state.products[0]?.id === action.payload.id) {
        // El producto ya es el más reciente, no hacer nada
        return state;
      }
      
      // Remover el producto si ya existe para evitar duplicados
      const filteredProducts = state.products.filter(p => p.id !== action.payload.id);
      
      // Agregar el nuevo producto al principio
      const newProduct: ViewedProduct = {
        ...action.payload,
        viewedAt: new Date().toISOString(),
      };

      // Mantener solo los últimos maxItems productos
      const updatedProducts = [newProduct, ...filteredProducts].slice(0, state.maxItems);

      return {
        ...state,
        products: updatedProducts,
      };
    }

    case 'REMOVE_PRODUCT': {
      const updatedProducts = state.products.filter(p => p.id !== action.payload);
      return {
        ...state,
        products: updatedProducts,
      };
    }

    case 'CLEAR_HISTORY':
      return {
        ...state,
        products: [],
      };

    case 'LOAD_HISTORY': {
      return {
        ...state,
        products: action.payload,
      };
    }

    default:
      return state;
  }
}

// Context
const RecentlyViewedContext = createContext<{
  state: RecentlyViewedState;
  dispatch: React.Dispatch<RecentlyViewedAction>;
} | null>(null);

// Provider Component
export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(recentlyViewedReducer, initialState);

  // Cargar historial desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('lunaria-recently-viewed');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        dispatch({ type: 'LOAD_HISTORY', payload: parsedHistory });
      }
    } catch (error) {
      console.error('Error loading recently viewed from localStorage:', error);
    }
  }, []);

  // Guardar en localStorage cuando cambie el estado (con debounce)
  useEffect(() => {
    if (state.products.length === 0) return; // No guardar array vacío inicial
    
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('lunaria-recently-viewed', JSON.stringify(state.products));
      } catch (error) {
        console.error('Error saving recently viewed to localStorage:', error);
      }
    }, 100); // Debounce de 100ms para evitar escrituras excesivas

    return () => clearTimeout(timeoutId);
  }, [state.products]);

  return (
    <RecentlyViewedContext.Provider value={{ state, dispatch }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

// Hook personalizado para usar recently viewed
export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }

  const { state, dispatch } = context;

  // Funciones helper
  const addProduct = (product: Omit<ViewedProduct, 'viewedAt'>) => {
    dispatch({ type: 'ADD_PRODUCT', payload: product });
  };

  const removeProduct = (productId: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  // Formato de precio helper
  const formatPrice = (cents: number) => {
    const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;
    
    const clp = cents / 100; // Convertir de centavos CLP a pesos CLP
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
    products: state.products,
    totalViewed: state.products.length,
    maxItems: state.maxItems,
    
    // Funciones
    addProduct,
    removeProduct,
    clearHistory,
    formatPrice,
  };
}
