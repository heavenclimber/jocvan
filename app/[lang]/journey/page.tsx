import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/app/[lang]/dictionaries";
import JourneyClient from "./JourneyClient";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <JourneyClient />;
}
