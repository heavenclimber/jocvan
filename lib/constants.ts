import type { NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#hero", index: 0 },
  { label: "About", href: "#about", index: 1 },
  { label: "Education", href: "#education", index: 2 },
  { label: "Skills", href: "#skills", index: 3 },
  { label: "Experience", href: "#experience", index: 4 },
  { label: "Portfolio", href: "#portfolio", index: 5 },
  { label: "Contact", href: "#contact", index: 6 },
];

export const SITE_CONFIG = {
  title: "Jocvan — Portfolio",
  description:
    "Personal CV & portfolio website showcasing projects, skills, and experience.",
  url: "https://jocvan.dev",
} as const;
