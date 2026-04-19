"use client";

import { experience } from "@/data/experience";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Timeline from "@/components/ui/Timeline";

export default function Experience() {
  const timelineItems = experience.map((item) => ({
    id: item.id,
    title: item.role,
    subtitle: `${item.company} — ${item.location}`,
    date: `${item.startDate} — ${item.endDate}`,
    bullets: item.bullets,
    tags: item.techStack,
  }));

  return (
    <SectionWrapper id="experience">
      <div className="gsap-animate mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-cyan-400 uppercase">
          Where I&apos;ve worked
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Experience
        </h2>
      </div>

      <Timeline items={timelineItems} />
    </SectionWrapper>
  );
}
