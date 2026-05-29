"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { useDict } from "@/lib/DictContext";

/* Lazy-load a mini 3D room preview */
const RoomPreview = dynamic(() => import("@/components/canvas/RoomPreview"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/60 border-t-transparent" />
    </div>
  ),
});

export default function PortfolioTeaser() {
  const dict = useDict();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    window.location.href = `/${lang}/portfolio`;
  };

  return (
    <SectionWrapper id="portfolio" className="flex flex-col !overflow-hidden">
      <div className="gsap-animate mb-4 flex-shrink-0">
        <p className="mb-1 text-sm font-medium tracking-widest text-amber-400 uppercase">
          {dict.portfolio.eyebrow}
        </p>
        <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          {dict.portfolio.heading}
        </h2>
      </div>

      {/* ── Interactive Room Teaser ── */}
      <div
        ref={containerRef}
        className="gsap-animate relative flex-1 min-h-0 w-full rounded-2xl overflow-hidden border border-white/10 cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
        aria-label="Enter the portfolio room"
      >
        {/* Room preview background */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            background:
              "radial-gradient(ellipse at center, #0f2847 0%, #091a33 50%, #060e1a 100%)",
            transform: hovered ? "scale(1.02)" : "scale(1)",
          }}
        >
          <Suspense fallback={null}>
            <RoomPreview />
          </Suspense>
        </div>

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 transition-opacity duration-500"
          style={{ opacity: hovered ? 0.4 : 0.6 }}
        />

        {/* Center CTA */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          {/* Animated room icon */}
          <div
            className="relative mb-4 transition-all duration-500"
            style={{
              transform: hovered ? "scale(1.1) translateY(-4px)" : "scale(1)",
            }}
          >
            <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🏠</span>
            </div>
            {/* Glow ring on hover */}
            <div
              className="absolute -inset-2 rounded-3xl border border-amber-400/30 transition-opacity duration-500"
              style={{ opacity: hovered ? 1 : 0 }}
            />
            <div
              className="absolute -inset-3 rounded-3xl blur-lg transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,180,71,0.15), transparent 70%)",
                opacity: hovered ? 1 : 0,
              }}
            />
          </div>

          {/* Text */}
          <h3
            className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight transition-all duration-500"
            style={{
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            Enter My Room
          </h3>
          <p
            className="text-sm text-amber-200/60 mb-4 tracking-wider uppercase transition-all duration-500"
            style={{
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            Explore my portfolio in 3D
          </p>

          {/* Click hint with pulse animation */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm transition-all duration-500"
            style={{
              transform: hovered ? "translateY(-2px) scale(1.05)" : "translateY(0)",
              borderColor: hovered
                ? "rgba(251, 191, 36, 0.4)"
                : "rgba(251, 191, 36, 0.2)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" />
            <span className="text-xs text-amber-200/70 font-medium tracking-widest">
              CLICK TO ENTER
            </span>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        </div>
      </div>
    </SectionWrapper>
  );
}
