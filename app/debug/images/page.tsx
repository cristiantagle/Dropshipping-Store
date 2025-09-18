import Image from "next/image";

const urls = [
  "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
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
