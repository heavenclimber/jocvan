"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { projects } from "@/data/projects";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { ProjectItem } from "@/types";

// Lazy-load the 3D scene to avoid SSR issues and reduce initial bundle
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
    </div>
  ),
});

export default function Portfolio() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  return (
    <SectionWrapper id="portfolio">
      <motion.div variants={fadeInUp} className="mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-purple-400 uppercase">
          Things I&apos;ve built
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Portfolio
        </h2>
      </motion.div>

      {/* 3D Canvas */}
      <motion.div variants={fadeInUp} className="mb-12">
        <Suspense fallback={null}>
          <Scene projects={projects} onSelect={setSelected} />
        </Suspense>
        <p className="mt-3 text-center text-xs text-zinc-600">
          Drag to rotate • Click a card to view details
        </p>
      </motion.div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12121a] p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-2 text-2xl font-bold text-white">
                {selected.title}
              </h3>
              <p className="mb-4 leading-relaxed text-zinc-400">
                {selected.description}
              </p>

              <div className="mb-6 flex flex-wrap gap-2">
                {selected.techStack.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>

              <div className="flex gap-3">
                {selected.liveUrl && (
                  <Button href={selected.liveUrl} variant="primary">
                    Live Demo
                  </Button>
                )}
                {selected.repoUrl && (
                  <Button href={selected.repoUrl} variant="outline">
                    Source Code
                  </Button>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 text-sm text-zinc-500 transition-colors hover:text-white cursor-pointer"
              >
                ← Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2D Fallback Grid (below the 3D scene for accessibility/SEO) */}
      <motion.div variants={fadeInUp}>
        <h3 className="mb-6 text-lg font-semibold text-zinc-300">
          All Projects
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <h4 className="mb-2 text-lg font-semibold text-white">
                {project.title}
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.techStack.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <div className="flex gap-3 text-sm">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 transition-colors hover:text-purple-300"
                  >
                    Live ↗
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 transition-colors hover:text-zinc-200"
                  >
                    Code ↗
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
