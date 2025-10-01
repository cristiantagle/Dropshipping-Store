'use client';
import React from "react";

type TrustItem = {
  icon: React.ReactNode;
  text: string;
};

export default function TrustStrip({ items }: { items: TrustItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <li
            key={i}
            className="rounded-2xl border bg-white shadow-sm px-4 py-3 flex items-center gap-2"
          >
            <span className="text-lg">{it.icon}</span>
            <span className="font-semibold text-gray-800">{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
