"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastProps } from '../components/Toast';

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: (id: string) => removeToast(id),
    };
    
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Render toasts */}
      <div className="fixed top-0 right-0 z-[10000] pointer-events-none">
        <div className="flex flex-col gap-2 p-4">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = context;

  // Helper functions for different toast types
  const showSuccess = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const showCartAction = useCallback((title: string, message?: string) => {
    addToast({ type: 'cart', title, message, duration: 2000 });
  }, [addToast]);

  return {
    addToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCartAction,
  };
}