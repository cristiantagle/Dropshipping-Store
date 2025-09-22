"use client";
import React from "react";

export default function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const onClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      aria-label="Volver arriba"
      onClick={onClick}
      className={`back-to-top ${visible ? "show" : ""}`}
    >
      ↑
    </button>
  );
}
