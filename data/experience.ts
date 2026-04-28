import type { ExperienceItem } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Software Developer",
    company: "PT Bank KEB Hana Indonesia",
    location: "Greater Jakarta, Indonesia",
    startDate: "Sep 2025",
    endDate: "Present",
    bullets: [
      "Developing and maintaining Unified Messaging System (UMS) for Hana Bank and LINE Bank, handling multi-channel messaging flows and vendor integrations.",
      "Implementing backend-facing features such as request validation, response normalization, error handling, and delivery status tracking.",
      "Designing and maintaining REST API integrations between frontend, internal services, and external vendors.",
      "Developing and maintaining LINE Bank’s landing website with focus on performance, security, and scalability.",
      "Building frontend modules for Aplikasi Jaminan Online (AJO) PLN to support Bank Guarantee lifecycle processing.",
      "Maintaining and enhancing LINE Bank’s hybrid web system, ensuring cross-platform compatibility and system stability.",
      "Applying clean architecture principles, reusable components, and version-controlled workflows."
    ],
    techStack: ["Next.js", "TypeScript", "REST API", "Git", "Hybrid Web"],
  },
  {
    id: "exp-2",
    role: "Front-end Developer",
    company: "PT Bank Sinarmas Tbk",
    location: "Greater Jakarta, Indonesia",
    startDate: "Aug 2024",
    endDate: "Sep 2025",
    bullets: [
      "Developed enterprise frontend applications for Loan Management System (LMS) and ABL System using Next.js and TypeScript.",
      "Integrated REST APIs using Axios, Promise-based handling, and useSWR for data synchronization.",
      "Handled production deployment setup, merge requests, and conducted peer code reviews.",
      "Implemented unit testing using Jest to improve application reliability.",
      "Developed reusable UI components using Material UI, Sinarmas Design System, and Tailwind CSS."
    ],
    techStack: ["Next.js", "TypeScript", "Axios", "useSWR", "Jest", "Material UI", "Tailwind CSS"],
  },
  {
    id: "exp-3",
    role: "Front-end Developer",
    company: "PT Mandala Multifinance Tbk",
    location: "Greater Jakarta, Indonesia",
    startDate: "Jan 2023",
    endDate: "Aug 2024",
    bullets: [
      "Developed React-based internal applications for head office and branch operations.",
      "Delivered production-ready modules with national deployment coverage.",
      "Maintained and refactored existing codebases to improve stability and maintainability.",
      "Worked closely with UI/UX designers and cross-functional teams."
    ],
    techStack: ["React", "JavaScript", "Frontend Architecture", "UI/UX Collaboration"],
  },
  {
    id: "exp-4",
    role: "Front-end Developer",
    company: "PT Digital Integrasi Asia",
    location: "Greater Jakarta, Indonesia",
    startDate: "Jun 2022",
    endDate: "Dec 2022",
    bullets: [
      "Developed and maintained React Native-based social media application.",
      "Implemented real-time video call, chat, and gifting features with Agora integration.",
      "Led frontend task assignments within sprint planning cycles.",
      "Migrated UI implementation toward TypeScript-based architecture."
    ],
    techStack: ["React Native", "TypeScript", "Agora", "Real-time Communication"],
  },
  {
    id: "exp-5",
    role: "Front-end Developer & UX Engineer",
    company: "Olympic Furniture Group",
    location: "Greater Jakarta, Indonesia",
    startDate: "Jun 2021",
    endDate: "Dec 2021",
    bullets: [
      "Designed and developed partner landing pages and internal event platforms.",
      "Produced UI/UX designs using Figma and translated them into production-ready frontend code."
    ],
    techStack: ["Figma", "UI/UX Design", "Frontend Development"],
  },
  {
    id: "exp-6",
    role: "Front-end Developer Intern",
    company: "PT Maybank Indonesia Finance Tbk",
    location: "Greater Jakarta, Indonesia",
    startDate: "Mar 2020",
    endDate: "Feb 2021",
    bullets: [
      "Completed onboarding covering frontend, backend, and mobile development fundamentals.",
      "Developed mobile credit analyst application and produced UI wireframes."
    ],
    techStack: ["Mobile Development", "UI Wireframing", "Fullstack Fundamentals"],
  }
];
