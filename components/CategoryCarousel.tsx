"use client";

import Link from "next/link";
import ProductCarousel from "./ProductCarousel";
import { Skeleton } from "./Skeleton";

interface Props {
  title: string;
  description: string;
  products: {
    id: string;
    name: string;
    name_es?: string;
    image_url: string;
    price_cents: number;
  }[];
  link: string;
  loading?: boolean;
}

export default function CategoryCarousel({ title, description, products, link, loading = false }: Props) {
  return (
    <section className="my-12">
      <div className="text-center mb-6 max-w-screen-md mx-auto px-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </>
        )}
      </div>
      <div className="max-w-screen-xl mx-auto px-6">
        <ProductCarousel products={products} loading={loading} />
      </div>
      <div className="mt-6 text-center">
        {loading ? (
          <Skeleton className="h-10 w-24 mx-auto rounded-lg" />
        ) : (
          <Link
            href={link}
            className="inline-block px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
          >
            Ver todo
          </Link>
        )}
      </div>
    </section>
  );
}
