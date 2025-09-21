import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import TrustStrip from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <main className="space-y-8">
      <Hero />
      <CategoryGrid />
      <TrustStrip />
    </main>
  );
}
