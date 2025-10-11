"use client";

import { useEffect, useState } from 'react';

export function useCartAnimations() {
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const [justAddedItems, setJustAddedItems] = useState<Set<string>>(new Set());

  const animateItemAdd = (itemId: string) => {
    setAnimatingItems(prev => new Set([...prev, itemId]));
    setJustAddedItems(prev => new Set([...prev, itemId]));

    // Remove from animating after animation completes
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 600); // Animation duration

    // Remove from just added after highlight period
    setTimeout(() => {
      setJustAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 2000); // Highlight duration
  };

  const animateItemRemove = (itemId: string) => {
    setAnimatingItems(prev => new Set([...prev, itemId]));
    
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const isAnimating = (itemId: string) => animatingItems.has(itemId);
  const isJustAdded = (itemId: string) => justAddedItems.has(itemId);

  return {
    animateItemAdd,
    animateItemRemove,
    isAnimating,
    isJustAdded,
  };
}