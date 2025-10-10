"use client";

export default function GlobalError() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">Ha ocurrido un error</h1>
      <div className="mt-6">
        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
