"use client";

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
      <div className="gsap-animate mb-12">
        <p className="mb-1 text-sm font-medium tracking-widest text-cyan-400 uppercase">
          My academic journey
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Education
        </h2>
      </div>

      <Timeline items={timelineItems} />
    </SectionWrapper>
  );
}
