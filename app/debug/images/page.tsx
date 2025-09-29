import Image from "next/imagen";

const urls = [
  "/lunaria-icon.png",
];
export const metadata = { title: "Debug imágenes — Lunaria" };
export default function DebugImages() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Debug imágenes (Unsplash)</h1>
      <p className="text-sm text-gray-600">Si alguna no carga, es config de imágenes y no UI.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {urls.map((u,i)=>(
          <div key={i} className="relative w-full h-48 border rounded overflow-hidden">
            <Image src={u} alt={`img-${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
