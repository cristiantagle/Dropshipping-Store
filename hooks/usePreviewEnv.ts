'use client';
import { useEffect, useState } from 'react';

export function usePreviewEnv() {
  const [isPreview, setIsPreview] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/health')
      .then((r) => r.json())
      .then((d: { env?: string }) => {
        if (cancelled) return;
        if (d?.env === 'preview') setIsPreview(true);
        else if (typeof window !== 'undefined' && window.location.hostname.includes('-git-'))
          setIsPreview(true);
      })
      .catch(() => {
        if (typeof window !== 'undefined' && window.location.hostname.includes('-git-'))
          setIsPreview(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return isPreview;
}
