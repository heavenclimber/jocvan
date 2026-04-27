import "server-only";
import type { Locale } from "@/lib/locales";

const dictionaries: Record<Locale, () => Promise<unknown>> = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  id: () => import("@/messages/id.json").then((m) => m.default),
};

export type { Locale }; // re-export for page/layout convenience
export type Dictionary = typeof import("@/messages/en.json");

export const hasLocale = (locale: string): locale is Locale =>
  ["en", "id"].includes(locale);

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]() as Promise<typeof import("@/messages/en.json")>;
