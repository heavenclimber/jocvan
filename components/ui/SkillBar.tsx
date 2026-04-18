"use client";

import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  level: number; // 0–100
  index?: number;
}

export default function SkillBar({ name, level, index = 0 }: SkillBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-300">{name}</span>
        <span className="font-mono text-xs text-zinc-500">{level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: index * 0.08,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}
