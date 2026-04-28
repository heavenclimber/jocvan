"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data/projects";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { ProjectItem } from "@/types";
import { useDict } from "@/lib/DictContext";

// Lazy-load the 3D scene to avoid SSR issues and reduce initial bundle
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  ),
});

export default function Portfolio() {
  const dict = useDict();
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  return (
    <SectionWrapper id="portfolio" className="flex flex-col !overflow-hidden">
      <div className="gsap-animate mb-6 flex-shrink-0">
        <p className="mb-1 text-sm font-medium tracking-widest text-blue-400 uppercase">
          {dict.portfolio.eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {dict.portfolio.heading}
        </h2>
      </div>

      {/* 3D Canvas */}
      <div className="gsap-animate relative flex-1 min-h-0 w-full rounded-2xl overflow-hidden border border-white/10">
        <Suspense fallback={null}>
          <Scene 
            projects={projects} 
            selectedProject={selected} 
            onSelect={setSelected} 
          />
        </Suspense>
        <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-400 pointer-events-none drop-shadow-md">
          Explore the Solar System • Click a planet to zoom in
        </p>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex pointer-events-none"
          >
            {/* Clickable backdrop to close */}
            <div 
              className="absolute inset-0 pointer-events-auto cursor-pointer"
              onClick={() => setSelected(null)}
            />
            
            {/* Right Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 z-10 w-full max-w-md flex flex-col justify-center overflow-y-auto border-l border-white/10 bg-[#000814]/90 p-8 backdrop-blur-xl shadow-2xl pointer-events-auto"
            >
              <h3 className="mb-4 text-3xl font-bold text-white">
                {selected.title}
              </h3>
              <p className="mb-6 leading-relaxed text-zinc-300">
                {selected.description}
              </p>

              <div className="mb-8 flex flex-wrap gap-2">
                {selected.techStack.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {selected.liveUrl && (
                  <Button href={selected.liveUrl} variant="primary" className="w-full justify-center">
                    {dict.portfolio.liveDemo}
                  </Button>
                )}
                {selected.repoUrl && (
                  <Button href={selected.repoUrl} variant="outline" className="w-full justify-center">
                    {dict.portfolio.viewCode}
                  </Button>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-8 self-start flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white cursor-pointer"
              >
                <span>←</span> Back to Solar System
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </SectionWrapper>
  );
}
