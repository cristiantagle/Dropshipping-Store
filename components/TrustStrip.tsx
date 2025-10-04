'use client';
import React from "react";

type TrustItem = {
  icon: React.ReactNode;
  text: string;
};

export default function TrustStrip({ items }: { items: TrustItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-10">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <li
            key={i}
            className="rounded-xl border bg-white shadow-md hover:shadow-lg transition px-5 py-4 flex items-center gap-3"
          >
            <span className="text-xl text-lime-600">{it.icon}</span>
            <span className="font-display font-semibold text-gray-800 tracking-tight leading-snug">{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
