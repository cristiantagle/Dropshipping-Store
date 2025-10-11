import CarroClient from "@/components/CarroClient";
import { Suspense } from 'react';

function CarroLoading() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    </main>
  );
}

export default function CarroPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <Suspense fallback={<CarroLoading />}>
        <CarroClient />
      </Suspense>
    </main>
  );
}
