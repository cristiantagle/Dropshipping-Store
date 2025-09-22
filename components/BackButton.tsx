'use client';
import { useRouter } from "next/navigation";

export default function BackButton({ label = "Volver" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/90 border border-gray-200 shadow-sm hover:shadow transition text-gray-700 hover:text-gray-900 backdrop-blur-sm"
      aria-label={label}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
