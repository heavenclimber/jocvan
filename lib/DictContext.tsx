"use client";

import { createContext, useContext } from "react";
import type enJson from "@/messages/en.json";

type Dictionary = typeof enJson;

const DictContext = createContext<Dictionary | null>(null);

export function DictProvider({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return <DictContext.Provider value={dict}>{children}</DictContext.Provider>;
}

export function useDict(): Dictionary {
  const ctx = useContext(DictContext);
  if (!ctx) throw new Error("useDict must be used within a DictProvider");
  return ctx;
}
