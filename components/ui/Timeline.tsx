"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  bullets?: string[];
  tags?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative ml-4 border-l border-white/10 pl-8">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={fadeInUp}
          custom={index}
          className="relative mb-12 last:mb-0"
        >
          {/* Dot */}
          <span className="absolute -left-[41px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-purple-500 bg-[#0a0a0f]">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          </span>

          {/* Date */}
          <span className="mb-1 block text-xs font-medium text-purple-400">
            {item.date}
          </span>

          {/* Title & Subtitle */}
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <p className="text-sm text-zinc-400">{item.subtitle}</p>

          {/* Description */}
          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              {item.description}
            </p>
          )}

          {/* Bullet list */}
          {item.bullets && item.bullets.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {item.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-zinc-400"
                >
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-purple-500/60" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-zinc-400 ring-1 ring-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
