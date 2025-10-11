import { Metadata } from 'next';
import OfertasClient from '@/components/OfertasClient';
import { getPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = getPageMetadata({
  title: 'Ofertas y Descuentos Especiales',
  description: 'Descubre las mejores ofertas y descuentos en productos seleccionados. Ahorra hasta un 70% en belleza, hogar, tecnología y más. ¡Ofertas por tiempo limitado!',
  path: '/ofertas',
  keywords: ['ofertas', 'descuentos', 'rebajas', 'promociones', 'baratos', 'liquidación', 'flash sale', 'Chile']
});

export default function OfertasPage() {
  return (
    <main className="min-h-screen">
      <OfertasClient />
    </main>
  );
}