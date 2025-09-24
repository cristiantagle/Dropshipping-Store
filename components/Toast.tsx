"use client";
import { useState } from "react";

let listeners: ((msg: string) => void)[] = [];

export function toast(msg: string) {
  listeners.forEach((fn) => fn(msg));
}

export default function Toast() {
  const [message, setMessage] = useState<string | null>(null);

  listeners = [setMessage];

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded">
      {message}
    </div>
  );
}
