"use client";

import { useEffect, useState } from "react";

interface SkillBarProps {
  name: string;
  level: number; // 0–100
  index?: number;
}

export default function SkillBar({ name, level, index = 0 }: SkillBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Animate from 0 to target level after a small staggered delay
    const timer = setTimeout(() => {
      setWidth(level);
    }, index * 80 + 100);
    return () => clearTimeout(timer);
  }, [level, index]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-300">{name}</span>
        <span className="font-mono text-xs text-zinc-500">{level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
