'use client';
import React from "react";

type Props = {
  className?: string;
  onSubmit?: (q: string) => void;
  placeholder?: string;
};

export default function SearchBar({ className = "", onSubmit, placeholder = "Buscar productos…" }: Props) {
  const [q, setQ] = React.useState("");
  function submit() {
    (onSubmit ?? ((val) => alert(`(Demo) Buscar: ${val}`)))(q.trim());
  }
  return (
    <div className={`relative flex items-center ${className}`} role="search">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        aria-label="Buscar"
        placeholder={placeholder}
        className="w-full md:w-72 rounded-xl border px-3.5 py-2 pr-9 text-sm bg-white/90 shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
      />
      <button
        type="button"
        onClick={submit}
        aria-label="Buscar"
        className="absolute right-1.5 inline-flex items-center justify-center size-8 rounded-lg hover:bg-neutral-100"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
