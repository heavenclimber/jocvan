"use client";

import { useBackground, BackgroundType } from "@/lib/BackgroundContext";
import { useEffect, useState } from "react";

const backgrounds: { id: BackgroundType; label: string }[] = [
  { id: "dot-pattern", label: "Dots" },
  { id: "vanta-fog", label: "Fog" },
  { id: "vanta-birds", label: "Birds" },
];

export default function BackgroundSwitcher() {
  const { background, setBackground } = useBackground();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentIndex = backgrounds.findIndex((bg) => bg.id === background);
  const nextBackground = () => {
    const nextIndex = (currentIndex + 1) % backgrounds.length;
    setBackground(backgrounds[nextIndex].id);
  };

  return (
    <button
      onClick={nextBackground}
      title={`Current Background: ${backgrounds[currentIndex]?.label}. Click to change.`}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-all duration-200 hover:text-white hover:bg-white/10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14.622 17.897 3.806 1.896a2 2 0 0 0 2.658-1.028l.53-1.064a2 2 0 0 0-1.027-2.657l-3.806-1.896" />
        <path d="M10.738 21.152a2 2 0 0 1-2.657-1.028l-5.367-10.76a2 2 0 0 1 1.028-2.657l.496-.246a2 2 0 0 1 2.657 1.028l5.367 10.76a2 2 0 0 1-1.028 2.657l-.496.246Z" />
        <path d="M9.884 16.015 15.39 5.051a2 2 0 0 1 2.657-1.028l.961.477a2 2 0 0 1 1.028 2.657L14.53 18.12l-4.646-2.105Z" />
      </svg>
      <span className="hidden sm:inline">{backgrounds[currentIndex]?.label}</span>
    </button>
  );
}
