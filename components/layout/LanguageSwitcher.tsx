"use client";

import { useRouter, usePathname } from "next/navigation";
import { LOCALES } from "@/lib/locales";
import type { Locale } from "@/lib/locales";

const FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  id: "🇮🇩",
};

const LABELS: Record<Locale, string> = {
  en: "EN",
  id: "ID",
};

interface LanguageSwitcherProps {
  currentLang: Locale;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (locale: Locale) => {
    if (locale === currentLang) return;
    // Replace the current locale segment in the path
    const segments = pathname.split("/");
    segments[1] = locale; // segments[0] is "", segments[1] is the locale
    router.push(segments.join("/") || "/");
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm p-1">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => switchTo(locale)}
          title={locale === "en" ? "English" : "Bahasa Indonesia"}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
            locale === currentLang
              ? "bg-blue-500/30 text-blue-200 ring-1 ring-blue-400/50"
              : "text-zinc-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base leading-none">{FLAGS[locale]}</span>
          <span>{LABELS[locale]}</span>
        </button>
      ))}
    </div>
  );
}
