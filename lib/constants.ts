import type { NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#footer" },
];

export const SITE_CONFIG = {
  title: "Jocvan — Portfolio",
  description:
    "Personal CV & portfolio website showcasing projects, skills, and experience.",
  url: "https://jocvan.dev",
} as const;
