"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useDict } from "@/lib/DictContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import BackgroundSwitcher from "@/components/layout/BackgroundSwitcher";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locales";

function navigateToSection(index: number) {
  const nav = (window as any).__navigateToSection;
  if (typeof nav === "function") nav(index);
}

interface NavbarProps {
  lang: Locale;
}

export default function Navbar({ lang }: NavbarProps) {
  const pathname = usePathname();
  const dict = useDict();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.includes('/journey')) return null;

  const handleNav = (e: React.MouseEvent, index?: number) => {
    e.preventDefault();
    if (index !== undefined) navigateToSection(index);
    setMobileOpen(false);
  };

  // Translated nav label lookup
  const navLabels: Record<string, string> = {
    "#hero": dict.nav.home,
    "#about": dict.nav.about,
    "#education": dict.nav.education,
    "#skills": dict.nav.skills,
    "#experience": dict.nav.experience,
    "#portfolio": dict.nav.portfolio,
    "#contact": dict.nav.contact,
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#000814]/80 shadow-lg shadow-blue-900/10 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <button
          onClick={(e) => handleNav(e, 0)}
          className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-xl font-bold text-transparent cursor-pointer"
        >
          JB
        </button>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.index)}
                className="text-sm text-zinc-400 transition-colors hover:text-white cursor-pointer"
              >
                {navLabels[link.href] ?? link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: Language Switcher + Background Switcher + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <BackgroundSwitcher />
          <LanguageSwitcher currentLang={lang} />

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span className={cn("h-0.5 w-6 rounded-full bg-white transition-all duration-300", mobileOpen && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 w-6 rounded-full bg-white transition-all duration-300", mobileOpen && "opacity-0")} />
            <span className={cn("h-0.5 w-6 rounded-full bg-white transition-all duration-300", mobileOpen && "-translate-y-2 -rotate-45")} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 top-0 z-40 flex flex-col items-center justify-center gap-8 bg-[#000814]/95 backdrop-blur-xl md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.index)}
                  className="text-2xl font-medium text-white transition-colors hover:text-blue-400 cursor-pointer"
                >
                  {navLabels[link.href] ?? link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
