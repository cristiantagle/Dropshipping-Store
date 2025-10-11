"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
  description?: string;
  description_es?: string;
}

export interface UseProductsResult {
  data: Product[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useProducts(limit?: number): UseProductsResult {
  const [data, setData] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        let query = supabase
          .from("products")
          .select("id, name, name_es, image_url, price_cents, category_slug, description, description_es")
          .not("image_url", "is", null)
          .order("id", { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data: products, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(`Error fetching products: ${fetchError.message}`);
        }

        setData(products || []);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { data, isLoading, isError, error };
}