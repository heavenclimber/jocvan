"use client";

import { useState } from "react";
import { skills } from "@/data/skills";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SkillBar from "@/components/ui/SkillBar";
import Badge from "@/components/ui/Badge";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <SectionWrapper id="skills">
      <div className="gsap-animate mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-cyan-400 uppercase">
          What I work with
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Skills</h2>
      </div>

      {/* Category Tabs */}
      <div className="gsap-animate mb-10 flex flex-wrap gap-3">
        {skills.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(i)}
            className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Badge active={i === activeCategory}>{cat.category}</Badge>
          </button>
        ))}
      </div>

      {/* Skill Bars */}
      <div
        key={activeCategory}
        className="gsap-animate mx-auto max-w-xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {skills[activeCategory].items.map((skill, i) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            level={skill.level}
            index={i}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
