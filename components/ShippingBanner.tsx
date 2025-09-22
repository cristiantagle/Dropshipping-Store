"use client";
import React from "react";

export default function ShippingBanner() {
  return (
    <div className="shipping-banner">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-center gap-3 text-sm">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-lime-600 text-white ring-2 ring-lime-300/50 shadow-sm">
          ✓
        </span>
        <p className="text-neutral-800">
          Envío <strong>rápido</strong> y soporte <strong>24/7</strong>. 💚
        </p>
      </div>
    </div>
  );
}
