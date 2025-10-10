"use client";
import Image from "next/image";

export default function DebugImages() {
  const imgs = [
    { src: "/img/test1.jpg", alt: "Imagen de prueba 1" },
    { src: "/img/test2.jpg", alt: "Imagen de prueba 2" },
    { src: "/img/test3.jpg", alt: "Imagen de prueba 3" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {imgs.map((img, idx) => (
        <div key={idx} className="rounded-xl overflow-hidden border">
          <Image
            src={img.src}
            alt={img.alt}
            width={400}
            height={300}
            className="object-cover w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}
