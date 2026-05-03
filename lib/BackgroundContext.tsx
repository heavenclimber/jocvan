"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type BackgroundType = "vanta-fog" | "vanta-birds" | "dot-pattern";

interface BackgroundContextType {
  background: BackgroundType;
  setBackground: (bg: BackgroundType) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [background, setBackgroundState] = useState<BackgroundType>("dot-pattern");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem("user-background") as BackgroundType | null;
    if (saved && ["vanta-fog", "vanta-birds", "dot-pattern"].includes(saved)) {
      setBackgroundState(saved);
    }
    setMounted(true);
  }, []);

  const setBackground = (bg: BackgroundType) => {
    setBackgroundState(bg);
    localStorage.setItem("user-background", bg);
  };

  if (!mounted) {
    // Prevent hydration mismatch by rendering children without context values until mounted,
    // or just render with default (it's safe as long as we don't render UI that depends heavily on the first frame).
    // Actually, best to just render children, but the initial background might flash. 
    // We'll keep it simple.
  }

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
