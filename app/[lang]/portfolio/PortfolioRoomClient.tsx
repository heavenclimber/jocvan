"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

const RoomScene = dynamic(() => import("@/components/canvas/RoomScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400/60 border-t-transparent animate-spin" />
        <p className="text-amber-200/60 text-sm tracking-widest uppercase animate-pulse">
          Loading Room...
        </p>
      </div>
    </div>
  ),
});

const RPGPortfolio = dynamic(
  () => import("@/components/portfolio/RPGPortfolio"),
  { ssr: false }
);

export default function PortfolioRoomClient() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  /* ── State ── */
  const [zoomedIn, setZoomedIn] = useState(false);
  const [speakerPlaying, setSpeakerPlaying] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showHints, setShowHints] = useState(true);

  /* Fade in on mount */
  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* Hide hints after 6 seconds */
  useEffect(() => {
    const t = setTimeout(() => setShowHints(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleMonitorClick = useCallback(() => {
    setZoomedIn(true);
  }, []);

  const handleMonitorExit = useCallback(() => {
    setZoomedIn(false);
  }, []);

  const handleSpeakerToggle = useCallback((playing: boolean) => {
    setSpeakerPlaying(playing);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0f2847 0%, #091a33 50%, #060e1a 100%)",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {/* ── 3D Room Canvas ── */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{
          opacity: zoomedIn ? 0 : 1,
          pointerEvents: zoomedIn ? "none" : "auto",
          transform: zoomedIn ? "scale(1.1)" : "scale(1)",
        }}
      >
        <Suspense fallback={null}>
          <RoomScene
            onMonitorClick={handleMonitorClick}
            onSpeakerToggle={handleSpeakerToggle}
            speakerPlaying={speakerPlaying}
          />
        </Suspense>
      </div>

      {/* ── RPG Portfolio Overlay ── */}
      {zoomedIn && (
        <div
          className="absolute inset-0 z-30 animate-rpg-boot"
          style={{ animationFillMode: "forwards" }}
        >
          <RPGPortfolio
            onExit={handleMonitorExit}
            speakerPlaying={speakerPlaying}
            onSpeakerToggle={handleSpeakerToggle}
          />
        </div>
      )}

      {/* ── Return to Home Button ── */}
      <button
        onClick={() => (window.location.href = `/${lang}`)}
        className="absolute top-6 left-6 z-40 group flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/20 text-amber-200/70 hover:text-amber-100 hover:bg-black/60 hover:border-amber-400/40 transition-all duration-300 text-sm cursor-pointer"
      >
        <ArrowLeft
          size={16}
          className="transform group-hover:-translate-x-1 transition-transform duration-300"
        />
        <span className="font-medium">Return Home</span>
      </button>

      {/* ── Interaction Hints ── */}
      {!zoomedIn && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: showHints ? 1 : 0 }}
        >
          <div className="flex items-center gap-6 text-xs text-amber-200/50 tracking-wider uppercase">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400/60 animate-pulse" />
              Click Monitor to Browse
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400/60 animate-pulse" />
              Click Speaker for Music
            </span>
          </div>
          <p className="text-[10px] text-white/20 tracking-widest">
            Drag to look around
          </p>
        </div>
      )}

      {/* ── Speaker status indicator ── */}
      {speakerPlaying && !zoomedIn && (
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-cyan-400/20">
          <div className="flex items-end gap-[2px] h-3">
            <div className="w-[3px] bg-cyan-400/80 rounded-full animate-eq-bar-1" />
            <div className="w-[3px] bg-cyan-400/80 rounded-full animate-eq-bar-2" />
            <div className="w-[3px] bg-cyan-400/80 rounded-full animate-eq-bar-3" />
            <div className="w-[3px] bg-cyan-400/80 rounded-full animate-eq-bar-4" />
          </div>
          <span className="text-[10px] text-cyan-300/70 tracking-widest uppercase">
            Now Playing
          </span>
        </div>
      )}
    </div>
  );
}
