"use client";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  noBackground?: boolean;
}

export default function SectionWrapper({
  children,
  id,
  className,
  noBackground = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto max-w-6xl w-full h-[70vh] overflow-y-auto overflow-x-hidden px-6 py-10 sm:px-8 lg:px-12 rounded-3xl",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        !noBackground && "bg-white/[0.03] backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10",
        className
      )}
    >
      {children}
    </section>
  );
}
