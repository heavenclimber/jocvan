"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { experience } from "@/data/experience";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Badge from "@/components/ui/Badge";
import Joystick from "@/components/ui/Joystick";
import { useDict } from "@/lib/DictContext";
import type { ExperienceItem } from "@/types";

// Dynamic import for Phaser Game to prevent SSR issues
const PhaserGame = dynamic(() => import("@/components/phaser/PhaserGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  ),
});

export default function Experience() {
  const dict = useDict();
  const [activeJob, setActiveJob] = useState<ExperienceItem | null>(null);
  const gameRef = useRef<any>(null);

  const handleNodeReached = useCallback((data: ExperienceItem) => {
    setActiveJob(data);
  }, []);

  const handleNodeLeft = useCallback(() => {
    setActiveJob(null);
  }, []);

  const handleJoystickMove = useCallback((direction: "LEFT" | "RIGHT" | "NONE") => {
    if (!gameRef.current) return;
    const scene = gameRef.current.scene.getScene("ExperienceScene");
    if (scene) {
      scene.joystickDir = direction;
    }
  }, []);

  return (
    <SectionWrapper id="experience" className="flex flex-col !overflow-hidden">
      <div className="gsap-animate mb-6 flex-shrink-0">
        <p className="mb-1 text-sm font-medium tracking-widest text-blue-400 uppercase">
          {dict.experience.eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {dict.experience.heading}
        </h2>
      </div>

      <div className="relative w-full flex-1 flex flex-col min-h-0">
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative">
          {/* Game Canvas */}
          <PhaserGame
            onNodeReached={handleNodeReached}
            onNodeLeft={handleNodeLeft}
            gameRef={gameRef}
          />

          {/* Job Details Overlay (Right Side) */}
          <AnimatePresence mode="wait">
            {activeJob && (
              <motion.div
                key={activeJob.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 bottom-4 w-full max-w-sm bg-[#000814]/80 border border-white/10 rounded-xl p-6 backdrop-blur-md overflow-y-auto pointer-events-auto shadow-2xl z-20"
              >
                <div className="flex flex-col gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">{activeJob.role}</h3>
                  <p className="text-blue-400 text-lg font-medium">{activeJob.company}</p>
                  <div>
                    <p className="text-zinc-300 font-medium">{activeJob.startDate} — {activeJob.endDate}</p>
                    <p className="text-zinc-500 text-sm">{activeJob.location}</p>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-6 text-sm">
                  {activeJob.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {activeJob.techStack.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper Text & Joystick Overlay */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-between items-end px-6 pointer-events-none z-30">
            {/* Draggable Joystick */}
            <div className="pointer-events-auto">
              <Joystick onMove={handleJoystickMove} />
            </div>

            {/* Helper Text */}
            <AnimatePresence mode="wait">
              {!activeJob && (
                <motion.div
                  key="helper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm text-zinc-300 text-sm font-medium border border-white/10 mb-6"
                >
                  Use Joystick or Left/Right arrows to explore
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
