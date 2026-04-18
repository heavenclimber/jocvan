"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { skills } from "@/data/skills";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SkillBar from "@/components/ui/SkillBar";
import Badge from "@/components/ui/Badge";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <SectionWrapper id="skills">
      <motion.div variants={fadeInUp} className="mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-purple-400 uppercase">
          What I work with
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Skills</h2>
      </motion.div>

      {/* Category Tabs */}
      <motion.div variants={fadeInUp} className="mb-10 flex flex-wrap gap-3">
        {skills.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(i)}
            className="cursor-pointer"
          >
            <Badge active={i === activeCategory}>{cat.category}</Badge>
          </button>
        ))}
      </motion.div>

      {/* Skill Bars */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-xl space-y-5"
      >
        {skills[activeCategory].items.map((skill, i) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            level={skill.level}
            index={i}
          />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
