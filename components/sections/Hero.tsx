"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { profile } from "@/data/profile";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div
          variants={fadeInUp}
          custom={0}
          className="mb-4 text-sm font-bold tracking-widest text-purple-600 uppercase drop-shadow-md"
        >
          Hello, I&apos;m
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          custom={1}
          className="mb-4 bg-gradient-to-r from-zinc-800 via-zinc-900 to-black bg-clip-text text-5xl leading-tight font-black tracking-tight text-transparent drop-shadow-md sm:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          custom={2}
          className="mb-2 text-xl font-bold text-zinc-800 sm:text-2xl drop-shadow-sm"
        >
          {profile.title}
        </motion.p>

        <motion.p
          variants={fadeInUp}
          custom={3}
          className="mx-auto mb-10 max-w-lg text-base font-medium text-zinc-700 drop-shadow-sm"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          custom={4}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/resume.pdf" variant="primary">
            Download CV
          </Button>
          <Button href="#footer" variant="outline">
            Get in Touch
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-zinc-800/60 pt-2"
        >
          <span className="h-2 w-0.5 rounded-full bg-zinc-800" />
        </motion.div>
      </motion.div>
    </section>
  );
}
