'use client';

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      <img
        src="https://iowpylofmfzlbvlhlqih.supabase.co/storage/v1/object/public/branding/hero/hero.png"
        alt="Hero Lunaria"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Bienvenido a Lunaria</h1>
      </div>
    </section>
  );
}
