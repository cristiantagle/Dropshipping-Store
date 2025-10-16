"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, Star } from "lucide-react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      className="relative overflow-hidden mt-16 min-h-[520px] sm:min-h-[540px] lg:h-[600px] flex items-center pt-6 sm:pt-8"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-3 h-3 bg-lime-400 rounded-full opacity-60" />
        </div>
        <div className="absolute top-32 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-2 h-2 bg-emerald-300 rounded-full opacity-40" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-4 h-4 bg-lime-300 rounded-full opacity-30" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 text-center lg:text-left">
        <div className={`transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white/90 text-sm font-medium">+10,000 clientes satisfechos</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl leading-tight">
            Descubre productos que{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-lime-300 via-emerald-400 to-lime-300 bg-clip-text text-transparent animate-shimmer bg-300%">
                inspiran
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full opacity-60" />
            </span>
          </h1>
          
          <p className={`mt-6 text-lg lg:text-xl text-white/90 drop-shadow-md max-w-2xl transition-all duration-1000 delay-300 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Tu tienda de confianza para <strong>belleza</strong>, <strong>hogar</strong> y más. 
            Calidad real, precios accesibles y envío gratuito.
          </p>
          
          <div className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-500 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <a
              href="/categorias"
              className="group inline-flex items-center gap-3 bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out backdrop-blur-sm border border-lime-400/30"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Explorar categorías
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <a
              href="/ofertas"
              className="group relative inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 ease-out"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Ver ofertas
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </a>
          </div>
          
          {/* Features */}
          <div className={`mt-12 flex flex-wrap justify-center lg:justify-start gap-6 text-white/80 text-sm transition-all duration-1000 delay-700 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              Envío gratuito
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              Garantía de calidad
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              Soporte 24/7
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
