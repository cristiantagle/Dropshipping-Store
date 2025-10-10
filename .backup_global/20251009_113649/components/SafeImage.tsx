"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

// Usa src de Supabase si viene; si falla o está vacío, muestra /lunaria-icon.png.
// No rompe el render en Server Components porque el error se maneja en cliente.
export default function SafeImage(props: ImageProps) {
  const { src, alt, ...rest } = props;
  const [error, setError] = useState(false);

  const resolved =
    !src || error || (typeof src === "string" && src.startsWith("http") && src.includes("images.unsplash.com"))
      ? "/lunaria-icon.png"
      : src;

  return (
    <Image
      {...rest}
      src={resolved as string}
      alt={alt || "Imagen"}
      onError={() => setError(true)}
    />
  );
}
