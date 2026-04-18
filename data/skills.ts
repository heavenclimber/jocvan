import type { SkillCategory } from "@/types";

export const skills: SkillCategory[] = [
  {
    category: "Frontend",
    items: [
      { name: "React / Next.js", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Framer Motion", level: 75 },
      { name: "Three.js / R3F", level: 60 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 80 },
      { name: "Express / Fastify", level: 75 },
      { name: "PostgreSQL", level: 70 },
      { name: "MongoDB", level: 65 },
      { name: "REST / GraphQL", level: 75 },
    ],
  },
  {
    category: "Tools & DevOps",
    items: [
      { name: "Git / GitHub", level: 90 },
      { name: "Docker", level: 65 },
      { name: "CI/CD", level: 70 },
      { name: "AWS", level: 60 },
      { name: "Figma", level: 75 },
    ],
  },
];
