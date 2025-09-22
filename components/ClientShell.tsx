'use client';

import React from 'react';
import TopBar from '@/components/TopBar';
import FloatingCart from '@/components/FloatingCart';
import BackToTopGuard from '@/components/BackToTopGuard';
import BackToTop from '@/components/BackToTop';

type Props = { children: React.ReactNode };

export default function ClientShell({ children }: Props) {
  return (
    <>
      <TopBar />
      <div className="mx-auto max-w-6xl px-4 py-6 pt-20">
        {children}
      </div>
      <FloatingCart />
      <BackToTopGuard />
      <BackToTop />
    </>
  );
}
