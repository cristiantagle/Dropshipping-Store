import { productos } from "@/lib/products";
import ProductListClient from "@/components/ProductListClient";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import TrustStrip from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <main className="space-y-8">
      <Hero />
      <CategoryGrid />
      <TrustStrip />
    
      <section className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="section-title">Tendencias</h2>
            <p className="section-sub">Lo más visto esta semana</p>
          </div>
        </div>
        {(() => {
          const src = Array.isArray(productos) ? productos : [];
          const items = src.slice(0, 12);
          return <ProductListClient items={items} />;
        })()}
      </section>
      <section className="mt-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="section-title">Nuevos</h2>
            <p className="section-sub">Acaban de llegar</p>
          </div>
        </div>
        {(() => {
          const src = Array.isArray(productos) ? productos : [];
          const items = src.slice(-12);
          return <ProductListClient items={items} />;
        })()}
      </section>
      <section className="mt-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="section-title">Mejor valorados</h2>
            <p className="section-sub">Selección destacada</p>
          </div>
        </div>
        {(() => {
          const src = Array.isArray(productos) ? productos : [];
          const items = src.slice(6, 18);
          return <ProductListClient items={items} />;
        })()}
      </section>
    </main>
  );
}
