'use client';
import React from "react";
export default function PageFade({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(t); }, []);
  return <div className={`page-fade ${mounted ? 'page-fade--in' : ''}`}>{children}</div>;
}
