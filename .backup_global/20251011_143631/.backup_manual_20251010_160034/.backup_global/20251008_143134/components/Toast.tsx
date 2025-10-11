'use client';
import React from "react";

export function Toast({ message }: { message: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 bg-black/80 text-white px-4 py-2 rounded-xl shadow-lg text-sm"
    >
      {message}
    </div>
  );
}
