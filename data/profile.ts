import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Jocvan",
  title: "Full-Stack Developer",
  tagline: "Crafting digital experiences with code & creativity",
  bio: [
    "I'm a passionate full-stack developer specializing in building modern web applications with cutting-edge technologies.",
    "I love transforming complex problems into elegant, intuitive solutions that make a real impact.",
  ],
  avatar: "/images/avatar.jpg",
  location: "Indonesia",
  email: "hello@jocvan.dev",
  languages: ["English", "Indonesian"],
  socials: [
    { platform: "GitHub", url: "https://github.com/jocvan", icon: "github" },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/jocvan",
      icon: "linkedin",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/jocvan",
      icon: "twitter",
    },
  ],
};
