"use client";

import { useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { useDict } from "@/lib/DictContext";
import { techStack, techCategories, type TechCategory } from "@/data/skills";

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
      className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 cursor-pointer transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07]"
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
      <div className="relative h-12 w-12 flex-shrink-0">
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
        className="text-xs font-semibold tracking-wide text-center leading-tight transition-colors duration-300"
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

  return (
    <SectionWrapper id="skills">
      {/* Heading */}
      <div className="gsap-animate mb-8">
        <p className="mb-1 text-sm font-medium tracking-widest text-blue-400 uppercase">
          {dict.skills.eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {dict.skills.heading}
        </h2>
      </div>

      {/* Category Filter Tabs */}
      <div className="gsap-animate mb-8 flex flex-wrap gap-2">
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

      {/* Tech Logo Grid */}
      <div
        key={activeCategory}
        className="gsap-animate grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {filtered.map((tech) => (
          <TechCard
            key={tech.name}
            name={tech.name}
            icon={tech.icon}
            color={tech.color}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
