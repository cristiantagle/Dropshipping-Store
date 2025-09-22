"use client";
import React from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductListClient({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-2xl shadow-md p-3 cursor-pointer float hover:shadow-xl transition-all fade-in"
        >
          <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-sm font-semibold">{p.name}</h3>
          <p className="text-emerald-600 font-bold">${p.price}</p>
        </div>
      ))}
    </div>
  );
}
