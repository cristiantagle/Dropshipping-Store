'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Flame,
  Clock,
  Percent,
  Filter,
  X,
  ChevronDown,
  Sparkles,
  Tag,
  TrendingDown,
  Zap,
  Star,
  ShoppingBag,
} from 'lucide-react';
import { useProducts } from '@/lib/useProducts';
import { useProductText } from '@/lib/useProductText';
import { useOptimizedCart } from '@/contexts/OptimizedCartContext';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import Image from 'next/image';

// Hook para generar ofertas dinámicas
function useOffers() {
  const [offerProducts, setOfferProducts] = useState<any[]>([]);

  useEffect(() => {
    // Simulamos ofertas dinámicas para hacer la página más atractiva
    const generateOffers = () => {
      const offers = [];
      const discountRanges = [10, 15, 20, 25, 30, 40, 50, 60, 70];

      // Ofertas flash (limitadas en tiempo)
      const flashCount = Math.floor(Math.random() * 3) + 2; // 2-4 ofertas flash
      for (let i = 0; i < flashCount; i++) {
        offers.push({
          type: 'flash',
          discount: discountRanges[Math.floor(Math.random() * discountRanges.length)],
          endTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000), // Hasta 24h
          badge: 'FLASH',
          priority: 1,
        });
      }

      // Ofertas del día
      const dailyCount = Math.floor(Math.random() * 4) + 3; // 3-6 ofertas del día
      for (let i = 0; i < dailyCount; i++) {
        offers.push({
          type: 'daily',
          discount: discountRanges[Math.floor(Math.random() * 6) + 2], // 20-50%
          badge: 'OFERTA DEL DÍA',
          priority: 2,
        });
      }

      // Ofertas regulares
      const regularCount = Math.floor(Math.random() * 6) + 4; // 4-9 ofertas regulares
      for (let i = 0; i < regularCount; i++) {
        offers.push({
          type: 'regular',
          discount: discountRanges[Math.floor(Math.random() * 5)], // 10-30%
          badge: 'DESCUENTO',
          priority: 3,
        });
      }

      return offers.sort((a, b) => a.priority - b.priority);
    };

    setOfferProducts(generateOffers());
  }, []);

  return offerProducts;
}

// Componente para mostrar countdown
function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1 text-xs font-bold text-red-600">
      <Clock className="h-3 w-3" />
      <span>
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

// Componente para tarjeta de producto con oferta
function OfferProductCard({ product, offer, index }: { product: any; offer: any; index: number }) {
  const { name: displayName } = useProductText(product);
  const { add } = useOptimizedCart();
  const { addToast } = useToast();

  const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
  const originalPrice = (product.price_cents / 100) * MARKUP; // Con markup unificado
  const discountedPrice = originalPrice * (1 - offer.discount / 100);
  const savings = originalPrice - discountedPrice;

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      name_es: product.name_es,
      price_cents: Math.round(discountedPrice * 100), // Precio con descuento (centavos)
      image_url: product.image_url,
    });

    addToast({
      type: 'cart',
      title: '¡Oferta agregada!',
      message: `${displayName} se agregó a tu carrito con ${offer.discount}% descuento`,
    });
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'flash':
        return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'daily':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:border-lime-200 hover:shadow-xl">
      {/* Badge de oferta */}
      <div
        className={`absolute top-3 left-3 z-10 ${getBadgeColor(offer.type)} rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg`}
      >
        {offer.badge}
      </div>

      {/* Porcentaje de descuento */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-sm font-bold text-white shadow-lg">
        <Percent className="h-3 w-3" />
        {offer.discount}
      </div>

      {/* Countdown para ofertas flash */}
      {offer.type === 'flash' && offer.endTime && (
        <div className="absolute top-12 right-3 z-10 rounded-md bg-black/80 px-2 py-1 text-white">
          <CountdownTimer endTime={offer.endTime} />
        </div>
      )}

      {/* Imagen del producto */}
      <Link href={`/producto/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image_url}
            alt={displayName || 'Producto'}
            width={400}
            height={400}
            unoptimized
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            priority={index < 6}
          />
        </div>
      </Link>

      {/* Información del producto */}
      <div className="p-4">
        <Link href={`/producto/${product.id}`}>
          <h3 className="mb-2 line-clamp-2 font-medium text-gray-900 transition-colors group-hover:text-lime-600">
            {displayName}
          </h3>
        </Link>

        {/* Precios */}
        <div className="mb-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-lime-600">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
              }).format(discountedPrice)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
              }).format(originalPrice)}
            </span>
          </div>
          <div className="text-xs font-medium text-green-600">
            Ahorras{' '}
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0,
            }).format(savings)}
          </div>
        </div>

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAddToCart}
          className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-500 px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-lime-600 hover:to-emerald-600"
        >
          <ShoppingBag className="h-4 w-4" />
          Agregar oferta
        </button>
      </div>
    </div>
  );
}

export default function OfertasClient() {
  const [filters, setFilters] = useState({
    type: 'all', // all, flash, daily, regular
    discount: 'all', // all, low (1-20%), medium (21-40%), high (41%+)
    sortBy: 'discount', // discount, price, newest
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading, isError } = useProducts();
  const offers = useOffers();

  // Combinar productos con ofertas
  const offerProducts =
    products?.slice(0, offers.length).map((product, index) => ({
      product,
      offer: offers[index],
    })) || [];

  // Filtrar productos
  const filteredProducts = offerProducts.filter(({ offer }) => {
    if (filters.type !== 'all' && offer?.type !== filters.type) return false;

    if (filters.discount !== 'all') {
      const discount = offer?.discount || 0;
      if (filters.discount === 'low' && discount > 20) return false;
      if (filters.discount === 'medium' && (discount <= 20 || discount > 40)) return false;
      if (filters.discount === 'high' && discount <= 40) return false;
    }

    return true;
  });

  // Ordenar productos
  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (filters.sortBy) {
      case 'discount':
        return (b.offer?.discount || 0) - (a.offer?.discount || 0);
      case 'price':
        const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
        const priceA =
          (a.product.price_cents / 100) * MARKUP * (1 - (a.offer?.discount || 0) / 100);
        const priceB =
          (b.product.price_cents / 100) * MARKUP * (1 - (b.offer?.discount || 0) / 100);
        return priceA - priceB;
      case 'newest':
        return parseInt(b.product.id) - parseInt(a.product.id);
      default:
        return 0;
    }
  });

  const flashOffers = offerProducts.filter(({ offer }) => offer?.type === 'flash');
  const totalSavings = offerProducts.reduce((total, { product, offer }) => {
    const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
    const originalPrice = (product.price_cents / 100) * MARKUP;
    const savings = (originalPrice * (offer?.discount || 0)) / 100;
    return total + savings;
  }, 0);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Error al cargar ofertas</h2>
          <p className="text-gray-600">Por favor intenta nuevamente más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 py-16 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
            opacity: 0.3,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Flame className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">Ofertas especiales activas</span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Ofertas que no puedes{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  resistir
                </span>
                <div className="absolute right-0 -bottom-2 left-0 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-red-400" />
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl text-white/90">
              Descuentos de hasta{' '}
              <strong className="text-yellow-300">
                {Math.max(...offers.map((o) => o.discount || 0))}%
              </strong>{' '}
              en productos seleccionados. ¡Aprovecha antes de que se acaben!
            </p>

            {/* Stats */}
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span className="text-2xl font-bold">{flashOffers.length}</span>
                </div>
                <p className="text-sm text-white/80">Ofertas Flash</p>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-300" />
                  <span className="text-2xl font-bold">{offers.length}</span>
                </div>
                <p className="text-sm text-white/80">Productos en oferta</p>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-blue-300" />
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalSavings)}
                  </span>
                </div>
                <p className="text-sm text-white/80">Ahorro total posible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {sortedProducts.length} ofertas disponibles
              </h2>
              {flashOffers.length > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {flashOffers.length} ofertas flash activas
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
            >
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Tipo de oferta */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tipo de oferta
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-lime-500 focus:outline-none"
                  >
                    <option value="all">Todas las ofertas</option>
                    <option value="flash">Ofertas Flash</option>
                    <option value="daily">Ofertas del día</option>
                    <option value="regular">Descuentos regulares</option>
                  </select>
                </div>

                {/* Rango de descuento */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Descuento</label>
                  <select
                    value={filters.discount}
                    onChange={(e) => setFilters((prev) => ({ ...prev, discount: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-lime-500 focus:outline-none"
                  >
                    <option value="all">Todos los descuentos</option>
                    <option value="low">Hasta 20%</option>
                    <option value="medium">21% - 40%</option>
                    <option value="high">Más de 40%</option>
                  </select>
                </div>

                {/* Ordenar por */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Ordenar por
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-lime-500 focus:outline-none"
                  >
                    <option value="discount">Mayor descuento</option>
                    <option value="price">Menor precio</option>
                    <option value="newest">Más reciente</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gray-100 bg-white shadow-md"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-10 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map(({ product, offer }, index) => (
              <OfferProductCard key={product.id} product={product} offer={offer} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Tag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No hay ofertas disponibles</h3>
            <p className="mb-6 text-gray-600">Intenta cambiar los filtros para ver más productos</p>
            <button
              onClick={() => setFilters({ type: 'all', discount: 'all', sortBy: 'discount' })}
              className="rounded-lg bg-lime-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-lime-600"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
