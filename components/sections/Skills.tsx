"use client";

import { useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { useDict } from "@/lib/DictContext";
import { techStack, techCategories, type TechCategory } from "@/data/skills";

// Adjust this value to make the carousel faster or slower.
// Higher number = faster scrolling.
const SCROLL_SPEED_PX_PER_SECOND = 40;

function TechCard({
  name,
  icon,
  color,
}: {
  name: string;
  icon: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  const svgUrl = `https://cdn.simpleicons.org/${icon}/${color}`;
  const glowColor = `#${color}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3 sm:p-5 cursor-pointer transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07] shrink-0 w-[100px] sm:w-[140px] md:w-[160px] lg:w-[calc(100vw/7-1.5rem)] max-w-[200px]"
      style={{
        boxShadow: hovered
          ? `0 0 24px 4px ${glowColor}33, 0 4px 24px 0 rgba(0,0,0,0.4)`
          : "0 4px 12px 0 rgba(0,0,0,0.2)",
        transform: hovered ? "translateY(-4px) scale(1.04)" : "translateY(0) scale(1)",
      }}
    >
      {/* Glow ring on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor}18 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
        <Image
          src={svgUrl}
          alt={name}
          width={48}
          height={48}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
          unoptimized
        />
      </div>

      {/* Name */}
      <span
        className="text-xs sm:text-sm font-semibold tracking-wide text-center leading-tight transition-colors duration-300 truncate w-full"
        style={{ color: hovered ? glowColor : "#94a3b8" }}
      >
        {name}
      </span>
    </div>
  );
}

export default function Skills() {
  const dict = useDict();
  const [activeCategory, setActiveCategory] = useState<TechCategory>("All");

  const filtered =
    activeCategory === "All"
      ? techStack
      : techStack.filter((t) => t.category === activeCategory);

  const catLabels: Record<TechCategory, string> = {
    All: "All",
    Frontend: "Frontend",
    Backend: "Backend",
    "Tools & DevOps": "Tools & DevOps",
  };

  // Split filtered skills into 2 rows
  const half = Math.ceil(filtered.length / 2);
  const baseRow1 = filtered.slice(0, half);
  const baseRow2 = filtered.slice(half);

  // Repeat items so that even short categories fill the width of the screen, preventing empty gaps
  const REPEAT_COUNT = 4;
  const row1 = Array(REPEAT_COUNT).fill(baseRow1).flat();
  const row2 = Array(REPEAT_COUNT).fill(baseRow2).flat();

  // Calculate dynamic duration so speed remains consistent regardless of how many items are in the row.
  // Each card is roughly 160px wide + 16px gap = 176px.
  const row1Duration = (row1.length * 176) / SCROLL_SPEED_PX_PER_SECOND;
  const row2Duration = (row2.length * 176) / SCROLL_SPEED_PX_PER_SECOND;

  return (
    <SectionWrapper id="skills" className="!overflow-hidden flex flex-col justify-center">
      <div className="overflow-hidden w-full py-4">
        {/* Heading */}
        <div className="gsap-animate mb-6">
          <p className="mb-1 text-sm font-medium tracking-widest text-blue-400 uppercase">
            {dict.skills.eyebrow}
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {dict.skills.heading}
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="gsap-animate mb-6 sm:mb-10 flex flex-wrap gap-2">
          {techCategories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active
                    ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/50"
                    : "bg-white/5 text-zinc-400 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {catLabels[cat]}
              </button>
            );
          })}
        </div>

        {/* Carousel Container */}
        <div className="flex flex-col gap-6 w-full relative" key={activeCategory}>
          
          {/* Row 1: Odd row -> Left to Right (scroll-right animation) */}
          <div 
            className="flex w-max animate-scroll-right hover:[animation-play-state:paused]"
            style={{ animationDuration: `${row1Duration}s` }}
          >
            <div className="flex w-max gap-4 pr-4">
              {row1.map((tech, idx) => (
                <TechCard key={`r1-1-${tech.name}-${idx}`} {...tech} />
              ))}
            </div>
            <div className="flex w-max gap-4 pr-4">
              {row1.map((tech, idx) => (
                <TechCard key={`r1-2-${tech.name}-${idx}`} {...tech} />
              ))}
            </div>
          </div>

          {/* Row 2: Even row -> Right to Left (scroll-left animation) */}
          <div 
            className="flex w-max animate-scroll-left hover:[animation-play-state:paused]"
            style={{ animationDuration: `${row2Duration}s` }}
          >
            <div className="flex w-max gap-4 pr-4">
              {row2.map((tech, idx) => (
                <TechCard key={`r2-1-${tech.name}-${idx}`} {...tech} />
              ))}
            </div>
            <div className="flex w-max gap-4 pr-4">
              {row2.map((tech, idx) => (
                <TechCard key={`r2-2-${tech.name}-${idx}`} {...tech} />
              ))}
            </div>
          </div>
          
          {/* Fading Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#000814] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#000814] to-transparent" />
        </div>
      </div>
    </SectionWrapper>
  );
}
