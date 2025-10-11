"use client";

import { useEffect, useState } from 'react';
import { Check, X, AlertCircle, ShoppingCart, Trash2 } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'cart';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, type, title, message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose(id);
      }, 300); // Animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300);
  };

  if (!isVisible) return null;

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <Trash2 className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
    cart: <ShoppingCart className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    cart: 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-800',
  };

  const iconStyles = {
    success: 'text-green-600 bg-green-100',
    error: 'text-red-600 bg-red-100',
    warning: 'text-yellow-600 bg-yellow-100',
    info: 'text-blue-600 bg-blue-100',
    cart: 'text-purple-600 bg-purple-100',
  };

  return (
    <div
      className={`
        fixed top-20 right-4 z-[10000] max-w-sm w-full pointer-events-auto
        transform transition-all duration-300 ease-out
        ${
          isExiting
            ? 'translate-x-full opacity-0 scale-95'
            : 'translate-x-0 opacity-100 scale-100'
        }
      `}
    >
      <div
        className={`
        rounded-xl shadow-lg border p-4 backdrop-blur-sm
        ${styles[type]}
      `}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${iconStyles[type]}
          `}
          >
            {icons[type]}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{title}</p>
            {message && <p className="text-xs mt-1 opacity-80">{message}</p>}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Legacy Toast component for backward compatibility
export function LegacyToast({ message }: { message: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 bg-black/80 text-white px-4 py-2 rounded-xl shadow-lg text-sm"
    >
      {message}
    </div>
  );
}
