import type { SkillCategory } from "@/types";

export interface TechItem {
  name: string;
  /** Simple Icons slug — see https://simpleicons.org */
  icon: string;
  /** Hex color (no #) from Simple Icons brand color */
  color: string;
  category: "Frontend" | "Backend" | "Tools & DevOps";
}

export const techStack: TechItem[] = [
  // ── Frontend ──────────────────────────────────────────
  { name: "React", icon: "react", color: "61DAFB", category: "Frontend" },
  { name: "Next.js", icon: "nextdotjs", color: "FFFFFF", category: "Frontend" },
  {
    name: "TypeScript",
    icon: "typescript",
    color: "3178C6",
    category: "Frontend",
  },
  {
    name: "JavaScript",
    icon: "javascript",
    color: "F7DF1E",
    category: "Frontend",
  },
  { name: "Jest", icon: "jest", color: "C21325", category: "Frontend" },

  {
    name: "Tailwind CSS",
    icon: "tailwindcss",
    color: "06B6D4",
    category: "Frontend",
  },
  {
    name: "Three.js",
    icon: "threedotjs",
    color: "FFFFFF",
    category: "Frontend",
  },
  {
    name: "Framer Motion",
    icon: "framer",
    color: "0055FF",
    category: "Frontend",
  },
  { name: "HTML5", icon: "html5", color: "E34F26", category: "Frontend" },
  { name: "CSS3", icon: "css", color: "1572B6", category: "Frontend" },
  { name: "GSAP", icon: "gsap", color: "0AE448", category: "Frontend" },
  {
    name: "Material UI (MUI)",
    icon: "mui",
    color: "007FFF",
    category: "Frontend",
  },
  {
    name: "Bootstrap",
    icon: "bootstrap",
    color: "7952B3",
    category: "Frontend",
  },
  {
    name: "Axios",
    icon: "axios",
    color: "5A29E4",
    category: "Frontend",
  },

  // ── Backend ───────────────────────────────────────────
  { name: "Node.js", icon: "nodedotjs", color: "5FA04E", category: "Backend" },
  { name: "Spring", icon: "spring", color: "6DB33F", category: "Backend" },
  {
    name: "Java SpringBoot",
    icon: "springboot",
    color: "6DB33F",
    category: "Backend",
  },

  {
    name: "PostgreSQL",
    icon: "postgresql",
    color: "4169E1",
    category: "Backend",
  },
  { name: "MongoDB", icon: "mongodb", color: "47A248", category: "Backend" },
  { name: "GraphQL", icon: "graphql", color: "E10098", category: "Backend" },
  { name: "Supabase", icon: "supabase", color: "34B27B", category: "Backend" },

  // { name: "Redis", icon: "redis", color: "FF4438", category: "Backend" },
  // { name: "Prisma", icon: "prisma", color: "2D3748", category: "Backend" },

  // ── Tools & DevOps ────────────────────────────────────
  { name: "Git", icon: "git", color: "F05032", category: "Tools & DevOps" },
  {
    name: "GitHub",
    icon: "github",
    color: "FFFFFF",
    category: "Tools & DevOps",
  },
  {
    name: "GitLab",
    icon: "gitlab",
    color: "FC6D26",
    category: "Tools & DevOps",
  },
  {
    name: "Docker",
    icon: "docker",
    color: "2496ED",
    category: "Tools & DevOps",
  },
  {
    name: "Firebase",
    icon: "firebase",
    color: "DD2C00",
    category: "Tools & DevOps",
  },
  { name: "Figma", icon: "figma", color: "F24E1E", category: "Tools & DevOps" },
  {
    name: "Elastic",
    icon: "elastic",
    color: "005571",
    category: "Tools & DevOps",
  },
  {
    name: "Vercel",
    icon: "vercel",
    color: "FFFFFF",
    category: "Tools & DevOps",
  },
  {
    name: "Netlify",
    icon: "netlify",
    color: "00C7B7",
    category: "Tools & DevOps",
  },
  { name: "Linux", icon: "linux", color: "FCC624", category: "Tools & DevOps" },
  {
    name: "Google Analytics",
    icon: "googleanalytics",
    color: "E37400",
    category: "Tools & DevOps",
  },
];

export const techCategories = [
  "All",
  "Frontend",
  "Backend",
  "Tools & DevOps",
] as const;
export type TechCategory = (typeof techCategories)[number];

// Legacy SkillCategory export kept for type compatibility
export const skills: SkillCategory[] = [
  { category: "Frontend", items: [] },
  { category: "Backend", items: [] },
  { category: "Tools & DevOps", items: [] },
];
