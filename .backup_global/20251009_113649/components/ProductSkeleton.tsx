'use client';
export default function ProductSkeleton(){
  return (
    <div className="rounded-xl border overflow-hidden bg-white">
      <div className="aspect-[4/3] bg-gray-100 skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 bg-gray-200 rounded skeleton" />
        <div className="h-3 w-1/2 bg-gray-200 rounded skeleton" />
        <div className="h-8 w-24 bg-gray-200 rounded-lg skeleton" />
      </div>
    </div>
  );
}
