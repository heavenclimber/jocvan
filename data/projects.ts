import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce application with real-time inventory, Stripe payments, and an admin dashboard.",
    image: "https://picsum.photos/seed/ecommerce/400/400",
    repoUrl: "https://github.com/jocvan/ecommerce",
    liveUrl: "https://shop.jocvan.dev",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind"],
  },
  {
    id: "proj-2",
    title: "Task Management App",
    description:
      "A collaborative project management tool with drag-and-drop Kanban boards, real-time sync, and team chat.",
    image: "https://picsum.photos/seed/taskapp/400/400",
    repoUrl: "https://github.com/jocvan/taskflow",
    liveUrl: "https://taskflow.jocvan.dev",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Docker"],
  },
  {
    id: "proj-3",
    title: "AI Content Generator",
    description:
      "An AI-powered content writing assistant with templates, SEO scoring, and export functionality.",
    image: "https://picsum.photos/seed/aigen/400/400",
    repoUrl: "https://github.com/jocvan/aigen",
    techStack: ["Next.js", "OpenAI API", "Prisma", "Redis", "Vercel"],
  },
  {
    id: "proj-4",
    title: "Crypto Dashboard",
    description: "Real-time cryptocurrency tracking with interactive charts and portfolio management.",
    image: "https://picsum.photos/seed/crypto/400/400",
    techStack: ["React", "Three.js", "WebSockets"],
  },
  {
    id: "proj-5",
    title: "Fitness Tracker App",
    description: "Mobile-first workout tracker with history, goals, and social features.",
    image: "https://picsum.photos/seed/fitness/400/400",
    techStack: ["Next.js", "Supabase", "Tailwind"],
  },
  {
    id: "proj-6",
    title: "Recipe Finder",
    description: "Discover new meals based on ingredients you have at home using a smart API.",
    image: "https://picsum.photos/seed/recipe/400/400",
    techStack: ["Vue.js", "Express", "MongoDB"],
  }
];
