'use client';
import TopBar from "@/components/TopBar";
import FloatingCart from "@/components/FloatingCart";
import BackToTopGuard from "@/components/BackToTopGuard";
import PreviewBadge from "@/components/PreviewBadge";
import Footer from "@/components/Footer";
import React from "react";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackToTopGuard />
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {children}
      </main>
      <Footer />
      <FloatingCart />
      <PreviewBadge />
    </>
  );
}
