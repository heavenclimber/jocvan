import type { ExperienceItem } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "Jakarta, Indonesia",
    startDate: "Jan 2024",
    endDate: "Present",
    bullets: [
      "Led the redesign of the customer-facing dashboard, improving user engagement by 35%.",
      "Built a component library with React, TypeScript, and Storybook used across 4 product teams.",
      "Implemented CI/CD pipelines and automated testing, reducing deployment errors by 60%.",
    ],
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "AWS"],
  },
  {
    id: "exp-2",
    role: "Junior Web Developer",
    company: "Digital Agency Co.",
    location: "Bandung, Indonesia",
    startDate: "Jun 2022",
    endDate: "Dec 2023",
    bullets: [
      "Developed responsive websites for 10+ clients using modern web standards.",
      "Integrated REST APIs and headless CMS solutions for dynamic content delivery.",
      "Collaborated with design teams to translate Figma mockups into pixel-perfect interfaces.",
    ],
    techStack: ["JavaScript", "Vue.js", "Node.js", "Figma", "MongoDB"],
  },
];
