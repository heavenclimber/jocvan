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
  title: "Jovan Maurel Bastian — Frontend Developer & Software Engineer",
  description:
    "Personal portfolio of Jovan Maurel Bastian (Jovan IT), a Frontend Developer specializing in React, Next.js, and interactive 3D web experiences.",
  url: "https://jocvan.dev",
  keywords: [
    "Jovan Maurel Bastian",
    "Jovan Bastian",
    "Jovan IT",
    "jovan frontend",
    "jovan react",
    "Jocvan",
    "Frontend Developer",
    "Software Engineer",
    "Next.js Developer",
    "React Developer",
    "Web Developer Indonesia"
  ],
  gaId: process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX",
} as const;
