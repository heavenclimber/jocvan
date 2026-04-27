// ── Shared TypeScript interfaces for all CV data ──

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Lucide icon name or SVG path
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  avatar: string;
  location: string;
  email: string;
  languages: string[];
  socials: SocialLink[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  gpa?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  techStack: string[];
}

export interface SkillItem {
  name: string;
  level: number; // 0–100
  icon?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  modelPath?: string; // optional .glb for 3D scene
}

export interface NavLink {
  label: string;
  href: string;
  index?: number;
}
