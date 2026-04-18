"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { education } from "@/data/education";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Timeline from "@/components/ui/Timeline";

export default function Education() {
  const timelineItems = education.map((item) => ({
    id: item.id,
    title: item.degree,
    subtitle: `${item.institution} — ${item.location}`,
    date: `${item.startDate} — ${item.endDate}`,
    description: `${item.description}${item.gpa ? ` | GPA: ${item.gpa}` : ""}`,
  }));

  return (
    <SectionWrapper id="education">
      <motion.div variants={fadeInUp} className="mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-purple-400 uppercase">
          My academic journey
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Education
        </h2>
      </motion.div>

      <Timeline items={timelineItems} />
    </SectionWrapper>
  );
}
