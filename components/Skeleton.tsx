import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animation = 'wave'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `.trim()}
      style={style}
    />
  );
}

// Componente específico para ProductCard
export function ProductCardSkeleton() {
  return (
    <div className="relative min-w-[200px] flex-shrink-0 bg-white rounded-xl shadow-sm flex flex-col">
      {/* Imagen skeleton */}
      <div className="w-full h-40 bg-gray-100 rounded-t-xl flex items-center justify-center">
        <Skeleton className="w-32 h-32" variant="rectangular" />
      </div>
      
      {/* Contenido skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        {/* Título - 2 líneas */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Precio */}
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

// Componente para skeleton de carrusel completo
export function CarouselSkeleton({ itemCount = 6 }: { itemCount?: number }) {
  return (
    <section className="my-12">
      {/* Header skeleton */}
      <div className="text-center mb-6 max-w-screen-md mx-auto px-4 space-y-3">
        <Skeleton className="h-8 w-64 mx-auto" /> {/* Título */}
        <Skeleton className="h-5 w-96 mx-auto" /> {/* Descripción */}
      </div>
      
      {/* Products skeleton */}
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: itemCount }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
      
      {/* Button skeleton */}
      <div className="mt-6 text-center">
        <Skeleton className="h-10 w-24 mx-auto rounded-lg" />
      </div>
    </section>
  );
}