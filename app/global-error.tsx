"use client";
'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('Global Error Boundary:', error);
  return (
    <html>
      <body>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Algo salió mal (global)</h2>
          <p className="mt-2 text-gray-600">Estamos trabajando en solucionarlo.</p>
          <div className="mt-6">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:bg-lime-700 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
