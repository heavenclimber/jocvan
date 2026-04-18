"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export default function SectionWrapper({
  children,
  id,
  className,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={cn(
        "relative mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12 rounded-3xl bg-white/30 backdrop-blur-md shadow-xl border border-white/40 my-16",
        className
      )}
    >
      {children}
    </motion.section>
  );
}
