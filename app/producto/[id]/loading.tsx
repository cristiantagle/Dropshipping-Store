export default function LoadingProduct(){
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="aspect-[4/3] skeleton" />
        </div>
        <div className="rounded-2xl border bg-white p-5 space-y-3">
          <div className="h-7 w-2/3 bg-gray-200 rounded skeleton" />
          <div className="h-4 w-1/3 bg-gray-200 rounded skeleton" />
          <div className="h-8 w-40 bg-gray-200 rounded skeleton mt-2" />
          <div className="h-20 w-full bg-gray-200 rounded skeleton mt-4" />
          <div className="h-10 w-44 bg-gray-200 rounded skeleton mt-6" />
        </div>
      </div>
    </main>
  );
}
