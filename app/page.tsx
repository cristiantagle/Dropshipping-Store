"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import RecentlyViewed from "@/components/RecentlyViewed";
import { createClient } from '@supabase/supabase-js';

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
}

interface CategoryData {
  products: Product[];
  loading: boolean;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Record<string, CategoryData>>({
    belleza: { products: [], loading: true },
    bienestar: { products: [], loading: true },
    eco: { products: [], loading: true },
    hogar: { products: [], loading: true },
    mascotas: { products: [], loading: true },
    tecnologia: { products: [], loading: true }
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchCategory = async (slug: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, name_es, image_url, price_cents, category_slug")
      .eq("category_slug", slug)
      .not("image_url", "is", null)
      .order("price_cents", { ascending: true })
      .limit(6);

    if (error) {
      console.error("Error cargando", slug, error.message);
      return [];
    }
    return data ?? [];
  };

  useEffect(() => {
    const loadCategories = async () => {
      const categoryKeys = Object.keys(categories);
      
      // Cargar categorías en paralelo para mejor performance
      const promises = categoryKeys.map(async (slug) => {
        const products = await fetchCategory(slug);
        return { slug, products };
      });

      const results = await Promise.all(promises);
      
      // Actualizar estado con pequeños delays para transiciones suaves
      results.forEach((result, index) => {
        setTimeout(() => {
          setCategories(prev => ({
            ...prev,
            [result.slug]: {
              products: result.products,
              loading: false
            }
          }));
        }, index * 200); // 200ms delay entre cada categoría
      });
    };

    loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Hero />

      {/* Sección de categorías con mejor spacing */}
      <div className="space-y-8 sm:space-y-12 lg:space-y-16 py-8">
        <div className="animate-fade-in-up">
          <CategoryCarousel
            title="Para tu rutina de belleza"
            description="Cuida tu piel y estilo con productos ecológicos"
            products={categories.belleza.products}
            link="/categorias/belleza"
            loading={categories.belleza.loading}
          />
        </div>

        <div className="animate-fade-in-up-delay-1">
          <CategoryCarousel
            title="Bienestar diario"
            description="Hidratación, descanso y energía para tu día"
            products={categories.bienestar.products}
            link="/categorias/bienestar"
            loading={categories.bienestar.loading}
          />
        </div>

        <div className="animate-fade-in-up-delay-2">
          <CategoryCarousel
            title="Hogar sustentable"
            description="Productos reutilizables que cuidan el planeta"
            products={categories.eco.products}
            link="/categorias/eco"
            loading={categories.eco.loading}
          />
        </div>

        <div className="animate-fade-in-up-delay-3">
          <CategoryCarousel
            title="Ambientes que relajan"
            description="Aromas, luz y orden para tu espacio personal"
            products={categories.hogar.products}
            link="/categorias/hogar"
            loading={categories.hogar.loading}
          />
        </div>

        <div className="animate-fade-in-up">
          <CategoryCarousel
            title="Para tu compañero fiel"
            description="Accesorios seguros y cómodos para tu mascota"
            products={categories.mascotas.products}
            link="/categorias/mascotas"
            loading={categories.mascotas.loading}
          />
        </div>

        <div className="animate-fade-in-up-delay-1">
          <CategoryCarousel
            title="Tecnología útil y portátil"
            description="Gadgets que simplifican tu vida, sin complicaciones"
            products={categories.tecnologia.products}
            link="/categorias/tecnologia"
            loading={categories.tecnologia.loading}
          />
        </div>
      </div>
      
      {/* Recently Viewed Products con mejor separación */}
      <div className="pt-12 pb-8">
        <RecentlyViewed maxItems={6} />
      </div>
    </main>
  );
}