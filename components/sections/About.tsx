"use client";

import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight } from "@/lib/motion";
import { profile } from "@/data/profile";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Badge from "@/components/ui/Badge";

export default function About() {
  const facts = [
    { label: "Location", value: profile.location },
    { label: "Email", value: profile.email },
    { label: "Languages", value: profile.languages.join(", ") },
  ];

  return (
    <SectionWrapper id="about">
      {/* Section Heading */}
      <motion.div variants={fadeInLeft} className="mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-purple-400 uppercase">
          Get to know me
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">About Me</h2>
      </motion.div>

      <div className="grid items-start gap-12 md:grid-cols-5">
        {/* Avatar */}
        <motion.div
          variants={fadeInLeft}
          className="flex justify-center md:col-span-2"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500/40 to-cyan-400/40 blur-lg" />
            <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-72 sm:w-72">
              {/* Placeholder avatar — replace with next/image once you add your photo */}
              <div className="flex h-full w-full items-center justify-center text-6xl text-zinc-600">
                {profile.name.charAt(0)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bio & Facts */}
        <motion.div variants={fadeInRight} className="space-y-6 md:col-span-3">
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-zinc-400">
              {paragraph}
            </p>
          ))}

          {/* Quick Facts */}
          <div className="grid gap-3 sm:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <p className="mb-1 text-xs text-zinc-500 uppercase">{f.label}</p>
                <p className="text-sm font-medium text-zinc-300">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-2">
            {profile.socials.map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer">
                <Badge>{s.platform}</Badge>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
