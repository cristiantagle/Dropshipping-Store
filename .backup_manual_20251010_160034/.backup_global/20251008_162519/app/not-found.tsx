"use client";

export default function NotFound() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-gray-600 mb-6">
        La página que buscas no existe o fue movida.
      </p>
      <a
        href="/"
        className="inline-block px-4 py-2 bg-lime-600 text-white rounded-lg"
      >
        Volver al inicio
      </a>
    </main>
  );
}
