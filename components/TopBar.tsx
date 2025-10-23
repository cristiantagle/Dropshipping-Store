'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import SearchBar from './SearchBar';
import { useOptimizedCart } from '@/contexts/OptimizedCartContext';
import MiniCart from './MiniCart';
import { useAuth } from '@/contexts/AuthContext';

export default function TopBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [cartHoverTimeout, setCartHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { totals } = useOptimizedCart();
  const { user, signOut, profile } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Cerrar el menÃ¢â€Å“Ã¢â€¢â€˜ de usuario al hacer click fuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!userMenuOpen) return;
      const el = userMenuRef.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [userMenuOpen]);

  // Fix hydration by ensuring client-side only rendering of cart count
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animate cart counter when totalItems changes
  useEffect(() => {
    if (isClient && totals.itemCount > 0) {
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isClient, totals.itemCount]);

  // Cleanup cart hover timeout on unmount
  useEffect(() => {
    return () => {
      if (cartHoverTimeout) {
        clearTimeout(cartHoverTimeout);
      }
    };
  }, [cartHoverTimeout]);

  const closeMenuSmooth = () => {
    if (!menuOpen) return;
    setMenuClosing(true);
    window.setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 300); // match .animate-slideOut duration
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (menuOpen) closeMenuSmooth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when menu is open and handle Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenuSmooth();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Close mobile menu on scroll/resize/orientation change for better UX
  useEffect(() => {
    if (!menuOpen) return;
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const delta = Math.abs(window.scrollY - lastY);
        if (delta > 10) {
          closeMenuSmooth();
        }
        lastY = window.scrollY;
        ticking = false;
      });
    };
    const onResize = () => closeMenuSmooth();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll as EventListener);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-[80] border-b border-gray-100/50 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Logo con Ã¢â€Å“Ã‚Â¡cono */}
        <Link
          href="/"
          className="group flex transform items-center gap-3 text-xl font-bold text-lime-700 transition-all duration-300 hover:scale-105 hover:text-lime-800"
        >
          <div className="relative">
            <Image
              src="/lunaria-icon.png" // o la URL de Supabase Storage si prefieres
              alt="Lunaria logo"
              width={32}
              height={32}
              className="rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <div className="absolute inset-0 rounded-lg bg-lime-400/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="tracking-tight">Lunaria</span>
        </Link>

        {/* Buscador centrado en desktop */}
        <div className="mx-6 hidden flex-1 justify-center md:flex">
          <SearchBar className="w-full max-w-md" />
        </div>

        {/* NavegaciÃ¢â€Å“Ã¢â€â€šn desktop */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <Link
            href="/categorias"
            className="group relative rounded-lg px-3 py-2 transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
          >
            <span className="relative z-10">{'Categor\u00EDas'}</span>
            <div className="absolute inset-0 scale-0 rounded-lg bg-gradient-to-r from-lime-500/0 via-lime-500/5 to-lime-500/0 transition-transform duration-300 group-hover:scale-100" />
          </Link>
          <Link
            href="/buscar"
            className="group relative rounded-lg px-3 py-2 transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
          >
            <span className="relative z-10">Buscar</span>
            <div className="absolute inset-0 scale-0 rounded-lg bg-gradient-to-r from-lime-500/0 via-lime-500/5 to-lime-500/0 transition-transform duration-300 group-hover:scale-100" />
          </Link>
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-lime-50/50 hover:text-lime-700"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                {/* Avatar */}
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-lime-600 text-xs text-white">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="avatar"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>
                      {(profile?.display_name || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline">
                  Hola, {profile?.display_name || user.email}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <Link
                    href="/cuenta"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cuenta
                  </Link>
                  <Link
                    href="/cuenta/pedidos"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Pedidos
                  </Link>
                  <Link
                    href="/cuenta/direcciones"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Direcciones
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut();
                      router.replace('/');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                  >
                    {'Cerrar sesi\u00F3n'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={{
                pathname: '/cuenta/login',
                query: {
                  return:
                    pathname &&
                    (pathname.startsWith('/cuenta/login') ||
                      pathname.startsWith('/cuenta/registro'))
                      ? '/'
                      : pathname || '/',
                },
              }}
              className="group relative rounded-lg px-3 py-2 transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
            >
              <span className="relative z-10">{'Iniciar sesi\u00F3n'}</span>
              <div className="absolute inset-0 scale-0 rounded-lg bg-gradient-to-r from-lime-500/0 via-lime-500/5 to-lime-500/0 transition-transform duration-300 group-hover:scale-100" />
            </Link>
          )}
          {user && (
            <button
              onClick={async () => {
                await signOut();
                router.replace('/');
              }}
              className="relative rounded-lg px-3 py-2 transition-all duration-300 hover:bg-red-50/50 hover:text-red-700"
              title={'Cerrar sesi\u00F3n'}
            >
              {'Cerrar sesi\u00F3n'}
            </button>
          )}
          <div
            className="group relative"
            onMouseEnter={() => {
              // Clear any pending close timeout
              if (cartHoverTimeout) {
                clearTimeout(cartHoverTimeout);
                setCartHoverTimeout(null);
              }
              setShowMiniCart(true);
            }}
            onMouseLeave={() => {
              // Add a delay before closing to allow movement to dropdown
              const timeout = setTimeout(() => {
                setShowMiniCart(false);
              }, 150); // 150ms delay gives time to move to dropdown
              setCartHoverTimeout(timeout);
            }}
          >
            <Link
              href="/carro"
              className="relative flex items-center rounded-lg px-3 py-2 transition-all duration-300 group-hover:scale-105 hover:bg-lime-50/50 hover:text-lime-700"
            >
              <ShoppingCart className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="font-medium">Carrito</span>
              {isClient && totals.itemCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg transition-all duration-300 ${cartPulse ? 'animate-cartPulse scale-110' : 'scale-100'} `}
                >
                  {totals.itemCount > 99 ? '99+' : totals.itemCount}
                </span>
              )}
            </Link>

            {/* Mini Cart Preview */}
            <MiniCart
              isVisible={showMiniCart}
              onMouseEnter={() => {
                // Clear timeout when hovering over dropdown
                if (cartHoverTimeout) {
                  clearTimeout(cartHoverTimeout);
                  setCartHoverTimeout(null);
                }
              }}
              onMouseLeave={() => {
                // Close immediately when leaving dropdown
                setShowMiniCart(false);
                if (cartHoverTimeout) {
                  clearTimeout(cartHoverTimeout);
                  setCartHoverTimeout(null);
                }
              }}
            />
          </div>
        </nav>

        {/* BotÃ¢â€Å“Ã¢â€â€šn menÃ¢â€Å“Ã¢â€¢â€˜ mÃ¢â€Å“Ã¢â€â€švil */}
        <button
          className="transform rounded-lg p-2.5 transition-all duration-300 hover:scale-110 hover:bg-lime-50 hover:text-lime-700 active:scale-95 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menÃ¢â€Å“Ã¢â€¢â€˜' : 'Abrir menÃ¢â€Å“Ã¢â€¢â€˜'}
          onClick={() => (menuOpen ? closeMenuSmooth() : setMenuOpen(true))}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* MenÃ¢â€Å“Ã¢â€¢â€˜ mÃ¢â€Å“Ã¢â€â€švil */}
      {menuOpen && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden ${menuClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
            onClick={closeMenuSmooth}
          />
          <div
            className={`relative z-[90] w-full max-w-full overflow-x-hidden border-t border-gray-100/50 bg-white/95 shadow-lg backdrop-blur-md md:hidden ${menuClosing ? 'animate-slideOut' : 'animate-slideIn'}`}
          >
            <nav className="flex flex-col gap-4 p-6 text-gray-700">
              <Link
                href="/categorias"
                className="rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
              >
                {'Categor\u00EDas'}
              </Link>
              <Link
                href="/buscar"
                className="rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
              >
                Buscar
              </Link>
              {user ? (
                <>
                  <Link
                    href="/cuenta"
                    className="rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
                  >
                    Cuenta
                  </Link>
                  <Link
                    href="/cuenta/pedidos"
                    className="rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
                  >
                    Pedidos
                  </Link>
                  <Link
                    href="/cuenta/direcciones"
                    className="rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
                  >
                    Direcciones
                  </Link>
                </>
              ) : (
                <Link
                  href={{
                    pathname: '/cuenta/login',
                    query: {
                      return:
                        pathname &&
                        (pathname.startsWith('/cuenta/login') ||
                          pathname.startsWith('/cuenta/registro'))
                          ? '/'
                          : pathname || '/',
                    },
                  }}
                  className="rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
                >
                  {'Iniciar sesi\u00F3n'}
                </Link>
              )}
              {user && (
                <button
                  onClick={async () => {
                    await signOut();
                    router.replace('/');
                  }}
                  className="rounded-lg px-4 py-3 text-left font-medium transition-all duration-300 hover:bg-red-50/50 hover:text-red-700"
                >
                  {'Cerrar sesi\u00F3n'}
                </button>
              )}
              <Link
                href="/carro"
                className="group flex items-center rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:bg-lime-50/50 hover:text-lime-700"
              >
                <ShoppingCart className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                Carrito
                {isClient && totals.itemCount > 0 && (
                  <span className="ml-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                    {totals.itemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
