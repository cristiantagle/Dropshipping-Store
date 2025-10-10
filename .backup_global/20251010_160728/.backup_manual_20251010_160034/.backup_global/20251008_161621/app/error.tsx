"use client";

export default function ErrorPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Error inesperado</h1>
      <p className="text-gray-600 mb-6">
        Lo sentimos, algo salió mal. Intenta nuevamente más tarde.
      </p>
      <button
        onClick={() => location.reload()}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        Reintentar
      </button>
    </main>
  );
}
