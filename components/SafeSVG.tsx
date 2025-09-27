"use client";

export default function SafeSVG({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src || "/lunaria-icon.png"}
      alt={alt || "icono"}
      className="w-20 h-20 mx-auto"
    />
  );
}
